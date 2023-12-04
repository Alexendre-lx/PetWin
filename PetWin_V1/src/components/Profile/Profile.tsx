import cn from 'classnames';
import Image, { StaticImageData } from 'next/image';
import userAvatar from '@petwin/images/userAvatar.png';
import Location from '@petwin/icons/location';
import styles from './profile.module.scss';
import ChoiceButton from '@petwin/components/common/ChoiceButton/ChoiceButton';
import React, { useState, useContext, useEffect } from 'react';
import ProfileSection from '@petwin/components/Profile/components/ProfileSection/ProfileSection';
import Achievements from '@petwin/components/Profile/components/Achievements/Achievements';
import Contests from '@petwin/components/Profile/components/Contests/Contests';
import Button from '@petwin/components/common/Button/Button';
import EditProfile from '@petwin/components/common/EditProfileModal/EditProfile';
import Container from '@petwin/components/common/Container/Container';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import { UserInfoData } from './Profile.props'
import { useRouter } from 'next/router';

import { Loader } from '../common/Loader/Loader';
import { ProfileSectionProps } from './components/ProfileSection/ProfileSection.props';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';

interface VoteData {
  id: string;
  participantName: string;
  postedAt: string;
  voterName: string;
  votes: number;
  profilePicture: string;
}


const Profile = () => {

  const router = useRouter();
  const { currentUser, getUserToken } = useContext(
    UserContext
  ) as UserContextType;

  const [userToken, setUserToken] = useState<string>('')

  

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userToken = await getUserToken(currentUser);
        setUserToken(userToken)
      }
    };

    fetchData();
  }, [currentUser]);

  const userID = router.query.userID as string;
  const [selected, setSelected] = useState<string>('Profile');
  const [editProfile, setEditProfile] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [participantsByOwner, setParticipantsByOwner] = useState<ProfileSectionProps['animalCardsList']>([]);
  const [isLoadingParticipantsByOwner, setIsLoadingParticipantsByOwner] = useState<boolean>(true);
  const [errorParticipantsByOwner, setErrorParticipantsByOwner] = useState<boolean>(false);

  const [participantsVotesByOwner, setParticipantsVotesByOwner] = useState<VoteData[]>([]);

  
  
  const fetchUserInfo = async() =>{
    try {
      const response = await axios.get(`http://localhost:8080/api/users/getUserInfo?userId=${currentUser?.uid}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        }
      });
      if (!response.data) {
        setError(true)
      }
      setUserInfo(response.data)
      setIsLoading(false)
    } catch (error) {
      setError(true)
    }
  }

  const fetchVotesByParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/votes/getParticipantVotesByOwner?ownerId=${currentUser?.uid}&limit=5`);
      if (!response.data) {
        setErrorParticipantsByOwner(true)
      }
      setParticipantsByOwner(response.data.participantByOwner)
      setParticipantsVotesByOwner(response.data.votes)
      setIsLoadingParticipantsByOwner(false)
    } catch (error) {
      setErrorParticipantsByOwner(true)
    }
  }

  const refetchAllData = () => {
    fetchUserInfo();
    fetchVotesByParticipants()
  }

  useEffect(()=>{
    if(currentUser && userToken){
      refetchAllData()
    }
  },[currentUser, userToken,  editProfile])

  if (isLoading || !userID || isLoadingParticipantsByOwner) return <Loader />;
  if (error || errorParticipantsByOwner) return <ErreurComponent onRetry={refetchAllData} />;

  function handleSelected(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setSelected(event.currentTarget.innerHTML);
  }

  const toggleEditProfile = () => {
    setEditProfile((prevState) => !prevState);
  };
  return (
    <>

      <Container className={cn(styles.ProfilePage)}>
        <div
          className={cn(
            'd-flex gap-3 items-center flex-wrap',
            styles.ProfileMainInfo
          )}
        >
          <div className="w-22 h-22 d-flex flex-column justify-content-center items-center">
            <Image
              src={userInfo?.profilePicture || userAvatar}
              width={100}
              height={100}
              alt="pet"
              className="!w-[100px] !h-[100px]"
            />
          </div>
          <div className="d-flex flex-column justify-content-center">
            <h3>{userInfo?.name}</h3>
            <div className={styles.Location}>
              <Location /> {userInfo?.location}
            </div>
          </div>
          <div className={styles.EditButtonContainer}>
            <Button
              orange
              md
              label="Modifier mon profil"
              onClick={toggleEditProfile}
            />
          </div>
        </div>
        <div className={styles.SwitchButtonsContainer}>
          <div className={cn(styles.SwitchButtonsWrapper)}>
            <ChoiceButton
              active={selected === 'Profile'}
              onClick={handleSelected}
            >
              Profile
            </ChoiceButton>
            <ChoiceButton
              active={selected === 'Concours'}
              onClick={handleSelected}
            >
              Concours
            </ChoiceButton>
            <ChoiceButton
              active={selected === 'Achievements'}
              onClick={handleSelected}
            >
              Achievements
            </ChoiceButton>
          </div>
        </div>
        {selected === 'Profile' && (
          <ProfileSection animalCardsList={participantsByOwner} participantsVotesByOwner={participantsVotesByOwner} />
        )}
        {selected === 'Concours' && <Contests userID={userID} />}
        {selected === 'Achievements' && <Achievements />}
      </Container>
      <EditProfile openModal={editProfile} handleClose={toggleEditProfile} userID={userID} userName={userInfo?.name || ''} userLocation={userInfo?.location || ''} 
      />

    </>
  );
};


export default Profile;
