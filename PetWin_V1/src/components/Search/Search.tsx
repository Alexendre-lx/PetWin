import styles from './search.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import ContestantItem from '@petwin/components/common/ContestantItem/ContestantItem';
import Container from '@petwin/components/common/Container/Container';

import Button from '../common/Button/Button';
import { Loader } from '../common/Loader/Loader';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';
interface searchParticipant {
  id: string;
  name: string;
  votes: number;
  place: number;
  owner_name: string;
  pictureURL: string;

}

const Search = () => {
  const [contestant, setContestant] = useState('');

  const [isLoadingParticipants, setIsLoadingParticipants] = useState<boolean>(false);
  const [isErrorParticipants, setIsErrorParticipants] = useState<boolean>(false);
  const [participants, setParticipants] = useState<searchParticipant[]>([]);



  const fetchSearchParticipants = async(
    participantName: string
  ) => {
    try {
      setIsLoadingParticipants(true)
      const response = await axios.get(
        `http://localhost:8080/api/participants/getParticipantByName?name=${participantName}`
      );
      if (!response.data) {
        setIsErrorParticipants(true) 
      }
      setParticipants(response.data)
      setIsLoadingParticipants(false)
    } catch (error) {
      setIsErrorParticipants(true) 
    }
  }
  return (
    <>
      <Container className={cn(styles.Search)}>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Entrez le nom d'un participant"
            className={cn(styles.Input, 'mt-0')}
            onChange={(e: any) => setContestant(e.target.value)}
          />
          <Button label="Rechercher" orange onClick={()=>fetchSearchParticipants(contestant)} />
        </div>
        {isLoadingParticipants ? (
          <Loader />
        ) : (
          participants &&
          (participants.length === 0 ? (
            <div className={styles.SearchResult}>Aucun participant trouvé.</div>
          ) : (
            <div className={styles.SearchResult}>
              {participants.map((contestant) => (
                <ContestantItem contestant={contestant} key={contestant.id} />
              ))}
            </div>
          ))
        )}
        {isErrorParticipants && (
                      <div className={styles.SearchResult}>Erreur</div>

        )

        }
      </Container>
    </>
  );
};

export default Search;
