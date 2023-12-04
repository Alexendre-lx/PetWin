import styles from './participateRegistered.module.scss';
import React, { useState, useContext, useEffect } from 'react';
import Image from 'next/image';

import cn from 'classnames';
import ParticipateMobile from '@petwin/icons/participateMobile';
import Button from '@petwin/components/common/Button/Button';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import { useRouter } from 'next/router';
import { Loader } from '../common/Loader/Loader';
import CongratulationsModal from '../common/CongratulationsModal/CongratulationsModal'
import MessageModal from '../common/MessageModal/MessageModal';
import ErreurComponent from '@petwin/components/Error/Error';
import { ProfileSectionProps } from '@petwin/components/Profile/components/ProfileSection/ProfileSection.props';
import axios from 'axios';

const ParticipateRegistered = ({
  petCreateFunc,
}: {
  petCreateFunc: React.MouseEventHandler<HTMLButtonElement>;
}) => {

  const { currentUser, getUserToken } = useContext(
    UserContext
  ) as UserContextType;

  const [userToken, setUserToken] = useState<string>('')
  const [participants, setParticipantsByOwner] = useState<ProfileSectionProps['animalCardsList']>([]);
  const [isLoadingParticipantsByOwner, setIsLoadingParticipantsByOwner] = useState<boolean>(true);
  const [errorParticipantsByOwner, setErrorParticipantsByOwner] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const fetchParticipantByOwner = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/participants/getParticipantByOwner?ownerId=${currentUser?.uid}`);
      if (!response.data) {
        setErrorParticipantsByOwner(true)
      }
      setParticipantsByOwner(response.data)
      setIsLoadingParticipantsByOwner(false)
    } catch (error) {
      setErrorParticipantsByOwner(true)
    }
  }

  const participate = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/participants/participate',
        {
          userId: currentUser?.uid,
          participantId: isChosen
        }, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
      })
    } catch (error) {
      setIsError(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userToken = await getUserToken(currentUser);
        setUserToken(userToken)
      }
    };

    fetchData();
  }, [currentUser]);

  const router = useRouter();
  const [isChosen, setIsChosen] = useState<string | null>(null);
  const [openCongratulationModal, setopenCongratulationModal] = useState<boolean>(false);
  const [openMessageModal, setopenMessageModal] = useState<boolean>(false);


  const choosePetHandler = (id: string | null) => {
    setIsChosen(id);
  };

  useEffect(() => {
    fetchParticipantByOwner()
  }, [currentUser])

  const Participate = async () => {
    await participate();
  }
  function toggleCongratulationModal() {
    setopenCongratulationModal((prevState) => !prevState);
  }
  function toggleMessageModal() {
    setopenMessageModal((prevState) => !prevState);
  }

  function getParticipantNameSelected(id: string) {
    const participantSelected = participants?.find(participant => id === participant.id)
    return participantSelected?.name
  }
  if (currentUser) {
    if (isLoadingParticipantsByOwner) return <Loader />;
    if (errorParticipantsByOwner) return <ErreurComponent onRetry={fetchParticipantByOwner} />;
  }

  return (
    <div className={styles.Form}>
      <div className={styles.FormContainer}>
        <h1 className={styles.Title}>Choisissez votre animal</h1>
        <div className={styles.PetsContainer}>
          {
            participants?.map((participant) => (
              <div
                key={participant.id}
                className={cn(
                  styles.PetContainer,
                  participant.isRegistered && styles.Registered,
                  isChosen && styles.Chosen
                )}
                onClick={() => choosePetHandler(!participant?.isRegistered ? participant?.id : null)}
              >
                <div className={styles.PetAvatar}>
                  <Image src={participant.pictureURL} width={100} height={100} alt={'pet'} />
                </div>
                <div className={styles.PetInfo}>
                  <div className={styles.PetName}>{participant.name}</div>
                  <div className={styles.IsRegistered}>
                    {participant.isRegistered ? 'Déjà inscrit' : 'Non inscrit'}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button onClick={petCreateFunc} className={styles.AddNewButton}>
          <ParticipateMobile /> Ajouter un nouveau participant
        </button>
        <div className={styles.ParticipateButtonContainer}>
          {isLoading ? (
            <Button label="Partciper" md disabled icon={<Loader />} />
          ) : (
            <Button label="Partciper" orange disabled={!isChosen} onClick={Participate} />
          )}
        </div>
      </div>
      <CongratulationsModal content={`${isChosen && getParticipantNameSelected(isChosen)} est inscrit`} openModal={openCongratulationModal} />
      <MessageModal content={"Désolé, il n'y pas a de concours actuellement !! Revenez plus tard"} openModal={openMessageModal} />
    </div>
  );
};

export default ParticipateRegistered;
