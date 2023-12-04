import ParticipateMultiForm from '@petwin/components/ParticipateMultiForm/ParticipateMultiForm';
import { useState, useContext, useEffect } from 'react';
import ParticipateRegistered from '@petwin/components/ParticipateRegistered/ParticipateRegistered';
import Head from 'next/head';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import { Loader } from '../components/common/Loader/Loader';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';
interface Pet {
  id: number;
  name: string;
  isRegistered: boolean;
  pictureURL: string;
}


const Participate = () => {
  const [isPetCreated, setIsPetCreated] = useState<boolean>(true);
  const { currentUser } = useContext(UserContext) as UserContextType;
  const [participants, setParticipantsByOwner] = useState<Pet[]>([]);
  const [isLoadingParticipantsByOwner, setIsLoadingParticipantsByOwner] = useState<boolean>(true);
  const [errorParticipantsByOwner, setErrorParticipantsByOwner] = useState<boolean>(false);


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
  useEffect(() => {
    fetchParticipantByOwner()
  }, [currentUser])

  function togglePetCreated() {
    setIsPetCreated(!isPetCreated);
  }
  if (currentUser) {
    if (isLoadingParticipantsByOwner) return <Loader />;
    if (errorParticipantsByOwner) return <ErreurComponent onRetry={fetchParticipantByOwner} />;
  }
  return (
    <>
      <Head>
        <title>Participate | PetWin</title>
      </Head>
      {!isPetCreated || !currentUser || participants?.length === 0 ? (
        <ParticipateMultiForm />
      ) : (
        <ParticipateRegistered petCreateFunc={togglePetCreated} />
      )}
    </>
  );
};

export default Participate;
