import Head from 'next/head';
import HomeHero from '@petwin/components/HomeHero/HomeHero';
import LatestVote from '@petwin/components/common/LatestVote/LatestVote';
import NewParticipant from '@petwin/components/common/NewParticipant/NewParticipant';
import RegisterToWin from '@petwin/components/common/RegisterToWin/RegisterToWin';
import cat from '@petwin/images/cat.png';
import dog from '@petwin/images/dog.png';
import Featured from '@petwin/components/common/Featured/Featured';
import InfiniteScroll from 'react-infinite-scroll-component';
import HelpThem from '@petwin/components/HelpThem/HelpThem';
import TheyWon from '@petwin/components/common/TheyWon/TheyWon';
import { useState, useEffect } from 'react';
import { LatestVoteProps } from '@petwin/components/common/LatestVote/LatestVote.props';
import { NewParticipantProps } from '@petwin/components/common/NewParticipant/NewParticipant.props';
import { Loader } from '@petwin/components/common/Loader/Loader';
import ErrorComponent from '@petwin/components/Error/Error'
import axios from 'axios';

export default function Home() {
  const [participants, setParticipants] = useState<NewParticipantProps['participantsList']>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState<boolean>(true);
  const [isErrorParticipants, setIsError] = useState<boolean>(false);

  const [votes, setVotes] = useState<LatestVoteProps['votesData']>([]);
  const [isLoadingLatestVotes, setIsLoadingLatestVotes] = useState<boolean>(true);
  const [isErrorLatestVotes, setIsErrorLatestVotes] = useState<boolean>(false);

  const [participantsWithoutVotes, setParticipantsWithoutVotes] = useState<NewParticipantProps['participantsList']>([]);
  const [isLoadingParticipantsWithoutVotes, setIsLoadingParticipantsWithoutVotes] = useState<boolean>(true);
  const [isErrorParticipantsWithoutVotes, setIsErrorParticipantsWithoutVotes] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [lastItemId, setLastItemId] = useState<string>('');


  const fetchLatestParticipants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/participants/getLatestParticipants?limit=3');
      setParticipants(response.data.latestParticipants);
      setIsLoadingParticipants(false);
    } catch (error) {
      setIsError(true);
    }
  };

  const fetchVotes = async (limit: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/votes/recentVotes?limit=${limit}`);
      setVotes(response.data);
      setIsLoadingLatestVotes(false);
    } catch (error) {
      setIsErrorLatestVotes(true);
    }
  };

  const fetchParticipantsWithoutVote = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/participants/getParticipantsWithoutVote?limit=6&lastItemId=${lastItemId}`);
      setParticipantsWithoutVotes((prevParticipants) => {
        return prevParticipants ? [...prevParticipants, ...response.data.participantsWithoutVotes] : response.data.participantsWithoutVotes;
      });
      setLastItemId(response.data.hasNextPage && response.data.participantsWithoutVotes[response.data.participantsWithoutVotes.length - 1].id);
      setHasNextPage(response.data.hasNextPage);
      setIsLoadingParticipantsWithoutVotes(false);
    } catch (error) {
      setIsErrorParticipantsWithoutVotes(true);
    }
  };


  const refetchAllData = () => {
    try {
      fetchLatestParticipants();
      fetchVotes(10);
      fetchParticipantsWithoutVote();
    } catch (error) {
      setIsError(false);
      setIsErrorLatestVotes(false);
      setIsErrorParticipantsWithoutVotes(false);
    }
  };

  useEffect(() => {
    refetchAllData();
  }, [setParticipants, setIsLoadingParticipants]);

  if (isLoadingParticipants || isLoadingParticipantsWithoutVotes || isLoadingLatestVotes)
    return <Loader />;
  if (isErrorParticipants || isErrorParticipantsWithoutVotes || isErrorLatestVotes)
    return <ErrorComponent onRetry={refetchAllData} />;

  return (
    <>
      <Head>
        <title>PetWin</title>
        <meta name="description" content="PetWin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeHero />
      <LatestVote orange votesData={votes} />
      <NewParticipant participantsList={participants} />
      <RegisterToWin
        src={cat}
        content={
          'Votre chat est-il le plus mignon ? Inscrivez le dés maintenant au plus grand concours photo et tentez de gagner 2000€'
        }
      />
      <Featured />
      <LatestVote orange votesData={votes} />
      <TheyWon />
      <LatestVote votesData={votes} />
      <div className="d-xl-block d-none">
        <RegisterToWin
          src={dog}
          right
          dogIcon
          content={
            'Votre chien est-il le plus mignon ? Inscrivez le dés maintenant au plus grand concours photo et tentez de gagner 2000€'
          }
        />
      </div>
      <div className="d-block d-xl-none">
        <RegisterToWin
          src={dog}
          dogIcon
          right
          content={
            'Votre chien est-il le plus mignon ? Inscrivez le dés maintenant au plus grand concours photo et tentez de gagner 2000€'
          }
        />
      </div>
      <InfiniteScroll
        dataLength={participantsWithoutVotes.length}
        next={fetchParticipantsWithoutVote}
        hasMore={hasNextPage}
        loader={<Loader />}
      >
        <HelpThem participants={participantsWithoutVotes} />
      </InfiniteScroll>


    </>
  );
}
