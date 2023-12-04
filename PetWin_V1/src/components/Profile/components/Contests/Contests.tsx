import styles from '@petwin/components/Profile/profile.module.scss';
import { Col, Row } from 'react-bootstrap';
import Button from '@petwin/components/common/Button/Button';
import SadEmoji from '@petwin/icons/sadEmoji';
import Image from 'next/image';
import catContest from '@petwin/images/catContest.png';
import ArrowCarousel from '@petwin/icons/arrowCarousel';
import Slider from 'react-slick';
import cn from 'classnames';
import { useRef, useState, useEffect } from 'react';
import { ContestsProps } from './Contests.props';
import { Loader } from '@petwin/components/common/Loader/Loader';
import ContestsImage from '@petwin/components/common/ContestsImage/ContestsImage';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';
interface UserVotesData {
  id: string;
  participantName: string;
  postedAt: string;
  voterName: string;
  profilePicture: string;
  votes: number;
}

interface ContestData {
  id: string,
  buttonSource: string,
  date: string,
  name: string,
  prize: string,
  contestants: string,
  trophy: {
    name: string,
    prize: string,
  }

}


const Contests = ({ userID }: ContestsProps) => {
  const slider = useRef<Slider | null>(null);


  const [userVotes, setUserVotes] = useState<UserVotesData[]>([]);

  const [votesUserParticipants, setVotesUserParticipants] = useState<UserVotesData[]>([]);

  const [contestByParticipant, setContestByParticipant] = useState<ContestData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isError, setIsError] = useState<boolean>(false);

  const fetchUserVotes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/votes/recentVotesForUser?voterId=${userID}&limit=10`);
      setUserVotes(response.data);
      setIsLoading(false)
    } catch (error) {
      setIsError(true);
    }
  };

  const fetchVotesUserParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/votes/votesUserParticipants?userId=${userID}&limit=10`);
      setVotesUserParticipants(response.data);
      setIsLoading(false)
    } catch (error) {
      setIsError(true);
    }
  };

  const fetchContestbyParticipant = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/contests/by-participant?ownerId=${userID}`);
      setContestByParticipant(response.data);
      setIsLoading(false)
    } catch (error) {
      setIsError(true);

    };
  }

  const fetchData = async () => {
    await Promise.all([
      fetchUserVotes(),
      fetchVotesUserParticipants(),
      fetchContestbyParticipant(),
    ]);
  };

  
  useEffect(() => {
    if(userID) fetchData();
  }, [userID]);



  if (isLoading) return <Loader />;
  if (isError) return <ErreurComponent onRetry={fetchData} />;



  return (
    <>
      <div className={styles.SectionContainer}>
        <div className={styles.SectionWrapper}>
          <div className={styles.Title}>Mes votes récents</div>
          <Row className={styles.RecentVotesWrapper}>
            <div className="position-relative d-block d-md-none">
              <div className={styles.SliderArrowsContainerPrev}>
                <button
                  className={cn(styles.SliderArrows, styles.Next)}
                  onClick={() => slider?.current?.slickPrev()}
                >
                  <ArrowCarousel />
                </button>
              </div>
              <div className={styles.SliderArrowsContainerNext}>
                <button
                  className={cn(styles.SliderArrows, styles.Prev)}
                  onClick={() => slider?.current?.slickNext()}
                >
                  <ArrowCarousel />
                </button>
              </div>
              <Slider ref={slider}>
                {userVotes.map((votes) => (
                  <div
                    key={votes.id}
                    className={cn(
                      styles.RecentVoteCard,
                      'd-flex flex-row justify-content-between px-4'
                    )}
                  >
                    <div className={styles.Avatar}>
                      <Image src={votes.profilePicture} width={35} height={35} alt={'avatar'} />
                    </div>
                    <div className={styles.PersonalInfo}>
                      <div className={styles.Name}>{votes.voterName} a voté pour {votes.voterName}</div>
                      <div className={styles.Timestamp}>{votes.postedAt}</div>
                    </div>
                    <div className={styles.Place}>{votes.votes}</div>
                  </div>
                ))}
              </Slider>
            </div>
            <div className="d-none d-md-flex gap-4">
              {userVotes?.map((votes) => (
                <Col key={votes.id} className={styles.RecentVoteCard}>
                  <div className={styles.Avatar}>
                    <Image src={votes.profilePicture} width={35} height={35} alt={'avatar'} />
                  </div>
                  <div className={styles.PersonalInfo}>
                    <div className={styles.Name}>{votes.voterName} a voté pour {votes.participantName}</div>
                    <div className={styles.Timestamp}>{votes.postedAt}</div>
                  </div>
                  <div className={styles.Place}>{votes.votes}</div>
                </Col>
              ))}
            </div>
          </Row>
        </div>
      </div>
      <div className={styles.SectionContainer}>
        <div className={styles.SectionWrapper}>
          <div className={styles.Title}>Qui a voté aujoud'hui ?</div>

          {votesUserParticipants ? (
            <Row className={styles.RecentVotesWrapper}>
              <div className="position-relative d-block d-md-none">
                <div className={styles.SliderArrowsContainerPrev}>
                  <button
                    className={cn(styles.SliderArrows, styles.Next)}
                    onClick={() => slider?.current?.slickPrev()}
                  >
                    <ArrowCarousel />
                  </button>
                </div>
                <div className={styles.SliderArrowsContainerNext}>
                  <button
                    className={cn(styles.SliderArrows, styles.Prev)}
                    onClick={() => slider?.current?.slickNext()}
                  >
                    <ArrowCarousel />
                  </button>
                </div>
                <Slider ref={slider}>
                  {votesUserParticipants.map((votes) => (
                    <div
                      key={votes.id}
                      className={cn(
                        styles.RecentVoteCard,
                        'd-flex flex-row justify-content-between px-4'
                      )}
                    >
                      <div className={styles.Avatar}>
                        <Image src={votes.profilePicture} width={35} height={35} alt={'avatar'} />
                      </div>
                      <div className={styles.PersonalInfo}>
                        <div className={styles.Name}>{votes.voterName} a voté pour {votes.voterName}</div>
                        <div className={styles.Timestamp}>{votes.postedAt}</div>
                      </div>
                      <div className={styles.Place}>{votes.votes}</div>
                    </div>
                  ))}
                </Slider>
              </div>
              <div className="d-none d-md-flex gap-4">
                {votesUserParticipants?.map((votes) => (
                  <Col key={votes.id} className={styles.RecentVoteCard}>
                    <div className={styles.Avatar}>
                      <Image src={votes.profilePicture} width={35} height={35} alt={'avatar'} />
                    </div>
                    <div className={styles.PersonalInfo}>
                      <div className={styles.Name}>{votes.voterName} a voté pour {votes.participantName}</div>
                      <div className={styles.Timestamp}>{votes.postedAt}</div>
                    </div>
                    <div className={styles.Place}>{votes.votes}</div>
                  </Col>
                ))}
              </div>
            </Row>
          ) :
            (
              <div className={styles.NoData}>
                <div className="flex justify-center pb-3">
                  <SadEmoji />
                </div>
                <div>Personne n'a voté aujourd'hui</div>
              </div>
            )}


        </div>
      </div >
      <div className={styles.SectionContainer}>
        <div className={styles.SectionWrapper}>
          <>
            <div className={styles.Title}>Mes concours</div>
            {contestByParticipant ? (

              contestByParticipant.map((contest: ContestData) => (
                <ContestsImage
                  buttonSource={contest.buttonSource}
                  key={contest.id}
                  dateTransparent
                  imageSource={catContest}
                  date={contest.date}
                  name={contest.name}
                  prize={contest.prize}
                  contestants={contest.contestants}
                  trophy={contest.trophy}
                />
              ))
            ) : (
              <div className={styles.NoData}>
                <div className="pb-3">
                  Vous ne participez actuellement pas à un concours
                </div>
                <div className={styles.ButtonWrapper}>
                  <Button orange md label="Participate" />
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Contests;