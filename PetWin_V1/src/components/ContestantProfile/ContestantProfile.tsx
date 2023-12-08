import styles from './contestantProfile.module.scss';
import Image from 'next/image';
import participantAvatar from '@petwin/images/participant.png';

import Location from '@petwin/icons/location';
import cn from 'classnames';
import Button from '@petwin/components/common/Button/Button';
import Share from '@petwin/icons/share';
import { Row } from 'react-bootstrap';
import Like from '@petwin/icons/like';
import ArrowCarousel from '@petwin/icons/arrowCarousel';
import ShareComment from '@petwin/icons/shareComment';
import ArrowDown from '@petwin/icons/arrowDown';
import LatestVote from '../common/LatestVote/LatestVote';
import { useContext, useEffect, useState } from 'react';
import Send from '@petwin/icons/send';
import Slider from 'react-slick';
import ContestantSliderItem from '../common/ContestantSliderItem/ContestantSliderItem';
import EditPetProfile from '@petwin/components/common/EditPetProfileModal/EditPetProfile';
import Container from '@petwin/components/common/Container/Container';
import PetProfilePhotos from '../common/PetProfilePhotos/PetProfilePhotos';
import Trophy from '@petwin/icons/trophy';
import { useRouter } from 'next/router';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import UserVoteBalanceModal from '@petwin/components/common/UserVoteBalanceModal/UserVoteBalanceModal';
import { Loader } from '../common/Loader/Loader';
import SignInModal from '@petwin/components/common/SignInModal/SignInModal';
import { LatestVoteProps } from '@petwin/components/common/LatestVote/LatestVote.props';
import { ContestantSliderItemProps } from '@petwin/components/common/ContestantSliderItem/ContestantSliderItemProps.props';
import Ellipsis from '@petwin/icons/ellipsis';
import ErreurComponent from '@petwin/components/Error/Error';
import ContestantEditPicture from '@petwin/components/common/ContestantEditPicture/ContestantEditPicture'
import CongratulationsModal from '../common/CongratulationsModal/CongratulationsModal';
import axios from 'axios';


interface Photo {
  id: number;
  imageSource: string;
}

interface ParticipantInfoResponse {
  name: string;
  breed: string;
  location: string;
  mainPhoto: string;
  ownerPicture: string;
  awards: {
    name: string;
    place: string;
  }[];
  description: string;
  ownerName: string;
  photos: Photo[];
  ownerId: string;
  contestIdInProgress: string;
  specie: string;
  rank: number;
  isRegistered: boolean
}

interface Comment {
  id: string;
  authorName: string;
  comment: string;
  postedAt: string;
  like: number;
  authorPicture: string;
  likesPeople: string[];
}

interface NextPreviousParticipant {
  hasParticipant: boolean;
  participantId: string;
}

interface PaginatedCommentResponse {
  comments: Comment[];
  hasNextPage: boolean;
}
const ContestantProfile = () => {
  const router = useRouter();
  const participantId = router.query.participantId as string;

  const defaultData = [
    {
      id: 0,
      imageSource: '',
    },
  ];

  const { currentUser, userProfilePicture, getUserToken } = useContext(
    UserContext
  ) as UserContextType;

  const defaultDataVotes = [
    {
      id: '',
      participantName: '',
      postedAt: '',
      voterName: '',
      votes: 0,
      profilePicture: '',
    },
  ];

  const SliderSettings = {
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const votesPrice = [
    {
      id: 0,
      priceId: 'price_1OFuQfHJ6LFTygo1gnguqCkM',
      votes: 1,
      price: 0,
    },
    {
      id: 1,
      priceId: 'price_1OFuQfHJ6LFTygo1gnguqCkM',
      votes: 150,
      price: 3,
    },
    {
      id: 2,
      priceId: 'price_1OFxLAHJ6LFTygo1Cr4EASz6',
      votes: 400,
      price: 6,
    },
    {
      id: 3,
      priceId: 'price_1OFySKHJ6LFTygo1t5NmxFAl',
      votes: 1000,
      price: 9.9,
    },
    {
      id: 4,
      priceId: 'price_1OFySsHJ6LFTygo1Ym0W36yE',
      votes: 2200,
      price: 19.9,
    },
    {
      id: 5,
      priceId: 'price_1OFyTQHJ6LFTygo1L9nJQW9D',
      votes: 5000,
      price: 39.9,
    },
    {
      id: 6,
      priceId: 'price_1OFyTxHJ6LFTygo1AeRZl8lZ',
      votes: 10000,
      price: 74.9,
    },
    {
      id: 7,
      priceId: 'price_1OFyUWHJ6LFTygo1UOiSoS0s',
      votes: 20000,
      price: 139.9,
    },
    {
      id: 8,
      priceId: 'price_1OFyUyHJ6LFTygo1p7mrgZVT',
      votes: 40000,
      price: 278.9,
    },
  ];




  const [userToken, setUserToken] = useState<string>('')
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [modalSelected, setModalSelected] = useState<string>('Votes');
  const [openSignInMenu, setOpenSignInMenu] = useState<boolean>(false);
  const [openSignUpMenu, setOpenSignUpMenu] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [ellipsisCollapsed, setEllipsisCollapsed] = useState<boolean>(false);
  const [editPicture, setEditPicture] = useState<boolean>(false)
  const [openCongratulationModal, setopenCongratulationModal] = useState<boolean>(false);
  const [contentCongratulation, setContentCongratulation] = useState<string>('');
  const [url, setUrl] = useState('');

  const [isLoadingParticipantData, setIsLoadingParticipantData] = useState<boolean>(true);
  const [isErrorParticipantData, setIsErrorParticipantData] = useState<boolean>(false);
  const [participantData, setParticipantData] = useState<ParticipantInfoResponse | null>(null);

  const [isLoadingParticipantVotes, setIsLoadingParticipantVotes] = useState<boolean>(true);
  const [isErrorParticipantVotes, setIsErrorParticipantVotes] = useState<boolean>(false);
  const [participantVotes, setParticipantVotes] = useState<LatestVoteProps['votesData']>([]);

  const [isLoadingParticipantComments, setIsLoadingParticipantComments] = useState<boolean>(true);
  const [isErrorParticipantComments, setIsErrorParticipantComments] = useState<boolean>(false);
  const [participantComments, setParticipantComments] = useState<Comment[]>([]);
  const [lastItemId, setLastItemId] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  const [isLoadingRandomParticipants, setIsLoadingRandomParticipants] = useState<boolean>(true);
  const [isErrorRandomParticipants, setIsErrorRandomParticipants] = useState<boolean>(false);
  const [randomParticipants, setRandomParticipants] = useState<ContestantSliderItemProps[]>([]);


  const [isErrorAddComment, setIsErrorAddComment] = useState<boolean>(false);

  const [isErrorLikeComment, setIsErrorLikeComment] = useState<boolean>(false);

  const [isErrorUnlikeComment, setIsErrorUnlikeComment] = useState<boolean>(false);


  const addComments = async (
    participantId: string,
    userId: string,
    comment: string,
    userToken: string
  ) => {
    try {
      const response = await axios.post('http://localhost:8080/api/comments/addComment', {
        participantId,
        userId,
        comment,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
      });

      if (!response.data) {
        setIsErrorAddComment(true);
      }

    } catch (error) {
      setIsErrorAddComment(true);
    }
  };

  const likeComment = async (
    commentId: string,
    userId: string,
    userToken: string
  ) => {
    try {
      const response = await axios.post('http://localhost:8080/api/comments/likeComment', {
        commentId,
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
      });

      if (!response.data) {
        setIsErrorLikeComment(true);
      }
    } catch (error) {
      setIsErrorLikeComment(true);
    }
  };

  const unlikeComment = async (
    commentId: string,
    userId: string,
    userToken: string
  ) => {
    try {
      const response = await axios.post('http://localhost:8080/api/comments/unlikeComment', {
        commentId,
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
      });

      if (!response.data) {
        setIsErrorUnlikeComment(true);
      }
    } catch (error) {
      setIsErrorUnlikeComment(true);

    }
  };



  const fetchParticipantData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/participants/getParticipantInfo`, {
        params: { participantId: participantId },
      });
      if (!response.data) {
        setIsErrorParticipantData(true);
      }
      setParticipantData(response.data);
      setIsLoadingParticipantData(false);
    } catch (error) {
      setIsErrorParticipantData(true);
    }
  };

  const fetchParticipantVotes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/votes/recentVotesForParticipant`, {
        params: { participantId: participantId, limit: 25 },
      });
      if (!response.data) {
        setIsErrorParticipantVotes(true);
      }
      setParticipantVotes(response.data);
      setIsLoadingParticipantVotes(false);
    } catch (error) {
      setIsErrorParticipantVotes(true);
    }
  };

  const fetchParticipantComments = async (participantId: string, lastItemId: string) => {
    try {
      const response = await axios.get<PaginatedCommentResponse>(`http://localhost:8080/api/comments/getCommentsForParticipant`, {
        params: {
          participantId: participantId,
          lastItemId: lastItemId,
          limit: 10,
        },
      });
      if (!response.data) {
        setIsErrorParticipantComments(true);
      }

      setParticipantComments((prevComments) => {
        return prevComments ? [...prevComments, ...response.data.comments] : response.data.comments
      });

      setLastItemId(response.data.hasNextPage ? response.data.comments[response.data.comments.length - 1].id : '');
      setHasNextPage(response.data.hasNextPage);
      setIsLoadingParticipantComments(false);
    } catch (error) {
      setIsErrorParticipantComments(true);

    }
  };


  const fetchRandomParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/participants/getRandomParticipants`, {
        params: { participantId: participantId },
      });
      if (!response.data) {
        throw new Error('Erreur lors de la requête');
      }
      setRandomParticipants(response.data);
      setIsLoadingRandomParticipants(false);
    } catch (error) {
      setIsErrorRandomParticipants(true);
    }
  };

  const fetchData = async () => {
    try {
      fetchParticipantData()

      fetchParticipantVotes();

      fetchParticipantComments(participantId, lastItemId)

      fetchRandomParticipants()

      setIsLoadingParticipantData(false)
      setIsLoadingParticipantVotes(false);
      setIsLoadingParticipantComments(false);
      setIsLoadingRandomParticipants(false);
    } catch (error) {
      setIsErrorParticipantData(true)
      setIsErrorParticipantVotes(true);
      setIsErrorParticipantComments(true);
      setIsErrorRandomParticipants(true);
    }
  };

  useEffect(() => {
    const fetchTokenUser = async () => {
      if (currentUser) {
        const userToken = await getUserToken(currentUser);
        setUserToken(userToken)
      }
    };
    fetchTokenUser();
  }, [currentUser]);


  useEffect(() => {
    if (participantId) {
      fetchData()
    };
    setUrl(window.location.href);
  }, [participantId, editPicture, editProfile]);


  if (
    !participantId ||
    isLoadingParticipantData ||
    isLoadingParticipantVotes ||
    isLoadingParticipantComments ||
    isLoadingRandomParticipants
  )
    return <Loader />;
  if (
    isErrorParticipantData ||
    isErrorParticipantVotes ||
    isErrorParticipantComments ||
    isErrorRandomParticipants ||
    isErrorAddComment ||
    isErrorLikeComment ||
    isErrorUnlikeComment
  )
    return <ErreurComponent onRetry={fetchData} />;

  const toggleEditProfile = () => {
    setEllipsisCollapsed(false)
    setEditProfile((prevState) => !prevState);
  };

  const toggleEditPicture = () => {
    setEllipsisCollapsed(false)
    setEditPicture((prevState) => !prevState)
  }

  const handleBalance = () => {
    setShowBalance((s) => !s);
  };

  const handleAddComment = async () => {

    if (currentUser && newComment.length !== 0) {
      await addComments(participantId, currentUser?.uid, newComment, userToken);
      setParticipantComments([]);
      fetchParticipantComments(participantId, '')
    } else if (!currentUser) {
      toggleSignUpMenu();
    }

  };
  const handleAddLike = async (commentId: string) => {

    if (currentUser) {
      await likeComment(commentId, currentUser?.uid, userToken);
      setParticipantComments(prevComments => prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, like: comment.like + 1, likesPeople: [...comment.likesPeople, currentUser.uid] }
          : comment
      ));
    }

  };

  const handleRemoveLike = async (commentId: string) => {

    if (currentUser) {
       await unlikeComment(commentId, currentUser?.uid, userToken);
      setParticipantComments((prevComments) => prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, like: comment.like - 1, likesPeople: comment.likesPeople.filter(id => id !== currentUser.uid) }
          : comment
      ));
    }

  };

  const commentIsLickedByUser = (likesPeople: string[]) => {
    if (likesPeople && likesPeople.find((id) => id === currentUser?.uid)) {
      return true;
    } else {
      return false;
    }
  };

  function handleModalSelect(key: string) {
    setModalSelected(key);
  }

  function toggleSignInMenu() {
    setOpenSignInMenu((prevState) => !prevState);
  }

  function toggleSignUpMenu() {
    setOpenSignUpMenu((prevState) => !prevState);
  }

  const handleNextOrPrevious = async () => {
    if (randomParticipants.length !== 0) {
      router.push(`/contestants/${randomParticipants[Math.floor(Math.random() * randomParticipants.length)].participantId}`);
    }

  };

  const handleEllipsisCollapsed = () => {
    setEllipsisCollapsed((prevState) => !prevState);
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setContentCongratulation('Vous pouvez maintenant partager ce lien')
      toggleCongratulationModal()
      setTimeout(() => {
        toggleCongratulationModal();
        setContentCongratulation('')
      }, 1000);
    } catch (err) {

    }
  };

  const handleClose = () => {
    setOpenModal((s) => !s);
    setShowBalance(false);
    toggleSignUpMenu();
  };

  function toggleCongratulationModal() {
    setopenCongratulationModal((prevState) => !prevState);
  }

  function findVotes(price: number) {
    const votesAmount = votesPrice.find(vote => vote.price === price);
    return votesAmount?.votes;
  }
  return (
    <>
      <Container className={cn(styles.ContestantProfile)}>
        <div className={cn(styles.Profile, 'p-0')}>
          <div
            className={cn(
              styles.MainInformation,
              'flex-column flex-md-row p-0'
            )}
          >
            <div className={cn(styles.Avatar, 'p-0 pb-3 p-md-5')}>
              <Image
                src={participantData?.mainPhoto!}
                alt={'avatar'}
                width={5000}
                height={5000}
              />
              {currentUser && currentUser.uid === participantData?.ownerId && (
                <>
                  <div
                    className={styles.EllipsisContainer}
                    onClick={handleEllipsisCollapsed}
                  >
                    <Ellipsis />
                  </div>
                  {ellipsisCollapsed && (
                    <div className={styles.ContestantMenu}>
                      <div onClick={toggleEditPicture}>Modifier les photos</div>
                      <div>Reposition</div>
                      <div onClick={toggleEditProfile}>Modifier le Profile</div>
                      <div
                        className={styles.Back}
                        onClick={handleEllipsisCollapsed}
                      >
                        Retour
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className={cn(styles.Species, 'px-3 w-100')}>
              <div className={cn(styles.Name, 'mb-2')}>
                {participantData?.name}
              </div>
              <div>
                <div className="flex items-center pb-[24px] gap-[20px]">
                  <div className={cn(styles.AnimalSpecies, 'p-2 px-3')}>
                    {participantData?.breed}
                  </div>
                  <div className={styles.Location}>
                    <Location />
                    {participantData?.location}
                  </div>
                </div>
                <div className={cn(styles.Prizes, 'row gap-0 p-0 m-0 mb-5')}>
                  {participantData &&
                    participantData?.awards.map((award, idx: number) => (
                      <div className="col-4 p-0 p-0" key={idx}>
                        <div
                          className={cn(
                            styles.PrizesCard,
                            'd-flex mx-1 ml-0 flex-column p-0 py-2'
                          )}
                        >
                          {idx !== 2 ? (
                            <>
                              <Trophy />
                              <div className={styles.Animal}>{award.name}</div>
                            </>
                          ) : (
                            <div className={styles.Animal}>Votes</div>
                          )}
                          <div className={styles.Place}>{award.place}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div
              className={cn(
                styles.VoteNowContainer,
                'd-flex justify-content-around mt-3 px-3 px-md-0 justify-content-md-center'
              )}
            >
              <div
                className={cn(styles.Arrow, styles.ArrowLeft)}
                onClick={() => handleNextOrPrevious()}
              >
                <ArrowCarousel />
              </div>
              <Button
                label="Voter maintenant"
                orange
                big
                className={styles.VoteNow}
                onClick={handleClose}
              />

              {!currentUser ? (
                openSignUpMenu ? (
                  <SignInModal
                    openModal={openSignUpMenu}
                    handleClose={toggleSignUpMenu}
                    isSignUpForm={true}
                  />
                ) : (
                  <SignInModal
                    openModal={openSignInMenu}
                    handleClose={toggleSignInMenu}
                  />
                )
              ) : (
                <UserVoteBalanceModal
                  openModal={openModal}
                  handleClose={handleClose}
                  modalSelected={modalSelected}
                  handleModalSelect={handleModalSelect}
                  showBalance={showBalance}
                  handleBalance={handleBalance}
                  participantData={participantData!}
                />
              )}
              <div
                className={cn(styles.Arrow, styles.ArrowRight)}
                onClick={() => handleNextOrPrevious()}
              >
                <ArrowCarousel />
              </div>
            </div>
          </div>
          <div className={cn(styles.SectionContainer, 'pt-[90px]')}>
            <div className={styles.SectionWrapper}>
              <div className={styles.Description}>
                {`" ${participantData?.description} "`}
              </div>
              <div
                className={cn(
                  styles.OwnerContainer,
                  'flex-row align-items-start justify-content-center justify-content-md-start  py-4 flex-wrap flex-md-nowrap'
                )}
              >
                <div
                  className={cn(
                    styles.Owner,
                    'd-flex flex-row justify-content-md-start justify-content-between gap-md-4 gap- w-100'
                  )}
                >
                  <div className={styles.OwnerWrapper}>
                    <div
                      className={cn(
                        styles.OwnerAvatar,
                        'd-flex flex-row justify-content-center align-items-center'
                      )}
                    >
                      <Image
                        src={participantData?.ownerPicture ? participantData.ownerPicture : participantAvatar}
                        width={50}
                        height={50}
                        alt={'owner-avatar'}
                      />
                    </div>
                    <div className={styles.OwnerName}>
                      {participantData?.ownerName}
                    </div>
                  </div>
                  <Button
                    className={styles.ShareButton}
                    label="Partager"
                    icon={<Share />}
                    onClick={handleCopyClick}
                  />
                </div>
              </div>
            </div>
          </div>

          <LatestVote
            voteFor={participantData?.name}
            votesData={participantVotes || defaultDataVotes}
          />

          {participantData?.photos.length !== 0 && (
            <div className={cn(styles.SectionContainer, 'mt-3 mt-md-5')}>
              <div className={styles.SectionWrapper}>
                <div className={styles.Title}>Photos</div>
                <PetProfilePhotos
                  photoArray={participantData?.photos || defaultData}
                />
              </div>
            </div>
          )}

          <div className={cn(styles.SectionContainer)}>
            <div className={cn(styles.SectionWrapper, '!border-none')}>
              <div className={styles.Title}>Commentaires</div>
              <div className={cn(styles.LeaveComment, 'row m-0')}>
                <div className={cn(styles.UserAvatar, 'col-3 p-0')}>
                  <Image
                    src={
                      userProfilePicture
                        ? userProfilePicture
                        : participantAvatar
                    }
                    width={50}
                    height={50}
                    alt={'user-avatar'}
                  />
                </div>
                <div className={cn(styles.LeaveCommentInput, 'col d-flex')}>
                  <input
                    type="text"
                    placeholder="Laisser votre commentaire"
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className={styles.SendButton}
                    onClick={handleAddComment}
                  >
                    <Send />
                  </button>
                </div>
              </div>
              {participantComments.length !== 0 && (

                participantComments.map((comment, index) => (
                  <div className={styles.CommentContainer} key={index}>
                    <div className={styles.CommentAvatar}>
                      <Image src={comment.authorPicture || participantAvatar} width={50} height={50} alt={'comment-avatar'} />
                    </div>
                    <div className={styles.CommentContent}>
                      <div className={styles.CommentWrapper}>
                        <div className={styles.Name}>{comment?.authorName}</div>
                        <div className={styles.Comment}>{comment.comment}</div>
                      </div>
                      <div className={styles.Action}>
                        <div className={styles.Timestamp}>{comment.postedAt}</div>
                        <div className={styles.Likes} onClick={() => {
                          if (comment.id) {
                            if (commentIsLickedByUser(comment.likesPeople) === false) {
                              handleAddLike(comment.id);
                            } else {
                              handleRemoveLike(comment.id);
                            }
                          }
                        }}>
                          <Like color={commentIsLickedByUser(comment.likesPeople) ? 'red' : 'black'} /> {comment.like}
                        </div>

                        <div className={styles.Share}>
                          <ShareComment />
                        </div>
                      </div>
                    </div>
                  </div>
                )))}
              {hasNextPage && (
                <button className={styles.LoadMore} onClick={() => fetchParticipantComments(participantId, lastItemId)}>
                  voir plus <ArrowDown />
                </button>
              )}
            </div>
          </div>
          <div className={cn(styles.ContestantsContainer, 'p-1 p-md-3 m-0')}>
            <Row className={cn(styles.Contestants, 'p-0 m-0 gap-0 d-flex')}>
              <div className="col-12 m-auto p-0 m-0 row">
                <Slider {...SliderSettings}>
                  {randomParticipants.map((participant) => (
                    <ContestantSliderItem
                      key={participant.participantId}
                      userPicture={participant.userPicture ? participant.userPicture : participantAvatar}
                      participantPicture={participant.participantPicture}
                      name={participant.name}
                      byName={participant.byName}
                      vote={participant.vote}
                      participantId={participant.participantId}
                    />
                  ))}
                </Slider>
              </div>
            </Row>
          </div>
        </div>
      </Container>

      <EditPetProfile
        openModal={editProfile}
        handleClose={toggleEditProfile}
        participantId={participantId}
        participantName={participantData?.name || ''}
        participantBreed={participantData?.breed || ''}
        participantDescription={participantData?.description || ''}
        ownerId={participantData?.ownerId || ''}
        participantSpecie={participantData?.specie || ''}
      />
      <ContestantEditPicture
        openModal={editPicture}
        handleClose={toggleEditPicture}
        participantId={participantId}
        ownerId={participantData?.ownerId || ''}
        participantSpecie={participantData?.specie || ''}
        participantPictures={participantData?.photos!}
        participantMainPicture={participantData?.mainPhoto!}

      />

      <CongratulationsModal content={contentCongratulation} openModal={openCongratulationModal} />
    </>
  );
};

export default ContestantProfile;
