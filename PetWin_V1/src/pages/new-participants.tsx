import NewParticipant from '@petwin/components/common/NewParticipant/NewParticipant';
import RegisterToWin from '@petwin/components/common/RegisterToWin/RegisterToWin';
import dog from '@petwin/images/dog.png';
import Head from 'next/head';
import { NewParticipantProps } from '@petwin/components/common/NewParticipant/NewParticipant.props'
import { Loader } from '@petwin/components/common/Loader/Loader';
import React, { useState, useEffect } from 'react';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';


function NewParticipantPage() {

  const [participants, setParticipants] = useState<NewParticipantProps['participantsList']>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState<boolean>(true);
  const [isErrorParticipants, setIsError] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [lastItemId, setLastItemId] = useState<string>('');


  const fetchLatestParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/participants/getLatestParticipantsByPage?limit=16&lastItemId=${lastItemId}`);
      setParticipants(response.data.latestParticipants);
      setHasNextPage(response.data.hasNextPage)
      setIsLoadingParticipants(false);
      setLastItemId(response.data.latestParticipants.length !== 0 && response.data.latestParticipants[response.data.latestParticipants.length-1].id)
    } catch (error) {
      setIsError(true);
    }
  };
  useEffect(() => {
    fetchLatestParticipants();
  }, []);



  if (isLoadingParticipants) return <Loader />;
  if (isErrorParticipants) return <ErreurComponent onRetry={fetchLatestParticipants}/>;
  return (
    <>
      <Head>
        <title>Nouveaux Participants | PetWin</title>
      </Head>
      <NewParticipant
        loadMoreData={fetchLatestParticipants}
        hasMore={hasNextPage}
        participantsList={participants}
      />
      <RegisterToWin
        src={dog}
        dogIcon
        content={
          'Votre chien est-il le plus mignon ? Inscrivez le dés maintenant au plus grand concours photo et tentez de gagner 2000€'
        }
      />
    </>
  );
}

export default NewParticipantPage;
