import React, { useEffect, useState } from 'react';
import styles from './contests.module.scss';
import catContest from '@petwin/images/catContest.png';
import catContest2 from '@petwin/images/catContest2.png';
import catContest3 from '@petwin/images/catContest3.png';
import dogContest2 from '@petwin/images/dogContest2.png';
import dogContest3 from '@petwin/images/dogContest3.png';
import labrador from '@petwin/images/labrador.png';
import TheyWon from '@petwin/components/common/TheyWon/TheyWon';
import ContestsImage from '../common/ContestsImage/ContestsImage';
import TestimonialsComponent from '@petwin/components/common/TestimonialsComponent/TestimonialsComponent';
import ChoiceButton from '@petwin/components/common/ChoiceButton/ChoiceButton';
import ParticipantIcon from '@petwin/icons/participantIcon';
import cn from 'classnames';
import ContestsMainImage from '../common/ContestMainImage/ContestsMainImage';
import Container from '@petwin/components/common/Container/Container';
import { Loader } from '../common/Loader/Loader';
import { StaticImageData } from 'next/image';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';
interface ContestData {
  id: string,
  buttonSource: string,
  date1: string,
  name: string,
  prize: string,
  contestants: string,
  trophy: {
    name: string,
    prize: string,
  }
}

interface ContestDataWinner {
  contestId: string,
  containerLink: string,
  date1: string,
  name: string,
  prize: string,
  contestants: string,
  imageSource: string | StaticImageData,
  isFinished: boolean,
}

function Contests() {
  const [selected, setSelected] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const [isLoadingContestInProgress, setIsLoadingContestInProgress] = useState<boolean>(true);
  const [isErrorContestInProgress, setIsErrorContestInProgress] = useState<boolean>(false);
  const [contestInProgress, setContestInProgress] = useState<ContestData[]>([]);

  const [isLoadingAllContests, setIsLoadingAllContests] = useState<boolean>(true);
  const [isErrorAllContests, setIsErrorAllContests] = useState<boolean>(false);
  const [allContests, setAllContests] = useState<ContestDataWinner[]>([]);
  const fetchContestInProgress = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/contests/in-progress`);
      if (!response.data) {
        setIsErrorContestInProgress(true)
      }
      setContestInProgress(response.data.validContestsInProgress)
      setIsLoadingContestInProgress(false)
    } catch (error) {
      setIsErrorContestInProgress(true)
    }
  }

  const fetchAllContests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/contests/all-info`);
      if (!response.data) {
        setIsErrorAllContests(true)
      }
      setAllContests(response.data)
      setIsLoadingAllContests(false)
    } catch (error) {
      setIsErrorAllContests(true)
    }
  }

  useEffect(() => {
    setSelected('Concours');
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  function handleSelected(event: React.MouseEvent<HTMLButtonElement>) {
    setSelected(event.currentTarget.innerHTML);
  }

  const testimonialsList = [
    {
      imageSource: catContest,
      name: 'JASEY S.',
      rating: 5,
      desc: 'My pumpkin won 48th in the world and 3rd in the state! He won $100 and it was super easy to get, it instantly got deposited 2 days later! It was very fun participating, thank you so much kingpet!',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest2,
      name: 'BAM',
      rating: 5,
      desc: 'The prizes are real 👍👍',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest3,
      name: 'MIKEADOO',
      rating: 5,
      desc: 'I enjoy seeing all the fur babies. I love animals and this is just a lot of fun. I love showing her off. Annabelle’s mommie',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest,
      name: 'JASEY S.',
      rating: 5,
      desc: 'My pumpkin won 48th in the world and 3rd in the state! He won $100 and it was super easy to get, it instantly got deposited 2 days later! It was very fun participating, thank you so much kingpet!',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest2,
      name: 'BAM',
      rating: 5,
      desc: 'The prizes are real 👍👍',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest3,
      name: 'MIKEADOO',
      rating: 5,
      desc: 'I enjoy seeing all the fur babies. I love animals and this is just a lot of fun. I love showing her off. Annabelle’s mommie',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest,
      name: 'JASEY S.',
      rating: 5,
      desc: 'My pumpkin won 48th in the world and 3rd in the state! He won $100 and it was super easy to get, it instantly got deposited 2 days later! It was very fun participating, thank you so much kingpet!',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest2,
      name: 'BAM',
      rating: 5,
      desc: 'The prizes are real 👍👍',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest3,
      name: 'MIKEADOO',
      rating: 5,
      desc: 'I enjoy seeing all the fur babies. I love animals and this is just a lot of fun. I love showing her off. Annabelle’s mommie',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest,
      name: 'JASEY S.',
      rating: 5,
      desc: 'My pumpkin won 48th in the world and 3rd in the state! He won $100 and it was super easy to get, it instantly got deposited 2 days later! It was very fun participating, thank you so much kingpet!',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest2,
      name: 'BAM',
      rating: 5,
      desc: 'The prizes are real 👍👍',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest3,
      name: 'MIKEADOO',
      rating: 5,
      desc: 'I enjoy seeing all the fur babies. I love animals and this is just a lot of fun. I love showing her off. Annabelle’s mommie',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest,
      name: 'JASEY S.',
      rating: 5,
      desc: 'My pumpkin won 48th in the world and 3rd in the state! He won $100 and it was super easy to get, it instantly got deposited 2 days later! It was very fun participating, thank you so much kingpet!',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest2,
      name: 'BAM',
      rating: 5,
      desc: 'The prizes are real 👍👍',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest3,
      name: 'MIKEADOO',
      rating: 5,
      desc: 'I enjoy seeing all the fur babies. I love animals and this is just a lot of fun. I love showing her off. Annabelle’s mommie',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest,
      name: 'JASEY S.',
      rating: 5,
      desc: 'My pumpkin won 48th in the world and 3rd in the state! He won $100 and it was super easy to get, it instantly got deposited 2 days later! It was very fun participating, thank you so much kingpet!',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest2,
      name: 'BAM',
      rating: 5,
      desc: 'The prizes are real 👍👍',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
    {
      imageSource: catContest3,
      name: 'MIKEADOO',
      rating: 5,
      desc: 'I enjoy seeing all the fur babies. I love animals and this is just a lot of fun. I love showing her off. Annabelle’s mommie',
      contest: 'cat contest',
      prize: '$100',
      date: '10 days ago',
    },
  ];

  const [hasMore, setHasMore] = useState(true);

  const refetchAllData = () => {
    fetchContestInProgress();
    fetchAllContests();
  }
  useEffect(() => {
    fetchContestInProgress();
    fetchAllContests();
  }, [])

  if (isLoadingContestInProgress || isLoadingAllContests) return <Loader />;
  if (isErrorContestInProgress || isErrorAllContests) return <ErreurComponent onRetry={refetchAllData} />;



  return (
    <>
      <Container className={cn(styles.contestsContainer)}>
        <div
          className={cn(
            'row d-flex justify-content-center text-center pt-10 d-none d-md-block pb-md-3 pb-0',
            styles.ContestsText
          )}
        >
          <ParticipantIcon />
          <h2>Concours</h2>
          <p>Votez pour votre animal préfère et aidez le à obtenir la 1er place</p>
        </div>
        <div
          className={cn(
            styles.buttonContainer,
            'justify-center d-flex flex-wrap gap-md-5 gap-1 mb-3 pt-3'
          )}
        >
          <ChoiceButton
            active={selected === 'Concours'}
            onClick={handleSelected}
          >
            Concours
          </ChoiceButton>
          <ChoiceButton
            active={selected === 'Gagnants'}
            onClick={handleSelected}
          >
            Gagnants
          </ChoiceButton>
          <ChoiceButton
            active={selected === 'Témoignages'}
            onClick={handleSelected}
          >
            Témoignages
          </ChoiceButton>
        </div>
        <div className={cn(styles.contestsImages, 'row gy-3 gy-md-0')}>
          {selected == 'Concours' ? (
            contestInProgress?.length === 0 ? (
              <div
                className={cn(
                  'row d-flex justify-content-center text-center pt-40',
                  styles.ContestsText
                )}
              >
                <h2>Aucun concours n'est en cours</h2>
              </div>
            ) : (
              isMobile ? (
                contestInProgress?.map((contest: ContestData) => (
                  <ContestsMainImage
                    buttonSource={contest.buttonSource}
                    key={contest.id}
                    imageSource={catContest}
                    date={contest.date1}
                    name={contest.name}
                    prize={contest.prize}
                    contestants={contest.contestants}
                    trophy={contest.trophy}
                  />
                ))
              ) : (
                contestInProgress?.map((contest: ContestData) => (
                  <ContestsImage
                    buttonSource={contest.buttonSource}
                    key={contest.id}
                    dateTransparent
                    imageSource={catContest}
                    date={contest.date1}
                    name={contest.name}
                    prize={contest.prize}
                    contestants={contest.contestants}
                    trophy={contest.trophy}
                  />
                ))
              ))
          ) : selected == 'Gagnants' ? (
            allContests.map((winner) =>
              isMobile ? (
                <ContestsMainImage
                  buttonSource={winner.containerLink}
                  key={winner.contestId}
                  imageSource={winner.imageSource}
                  date={winner.date1}
                  name={winner.name}
                  prize={winner.prize}
                  contestants={winner.contestants}
                  isFinished={winner.isFinished}
                  viewWinners
                />
              ) : (
                <ContestsImage
                  columns={6}
                  lgColumns={4}
                  key={winner.contestId}
                  isFinished={winner.isFinished}
                  imageSource={winner.imageSource}
                  date={winner.date1}
                  name={winner.name}
                  prize={winner.prize}
                  contestants={winner.contestants}
                  containerLink={winner.containerLink}
                />
              )
            )
          ) : selected == 'Témoignages' ? (
            testimonialsList.map((testimonial, idx) => (
              <TestimonialsComponent
                key={idx}
                imageSource={testimonial.imageSource}
                name={testimonial.name}
                rating={5}
                desc={testimonial.desc}
                contest={testimonial.contest}
                date={testimonial.date}
                prize={testimonial.prize}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </Container>
      {selected === 'Concours' ? <TheyWon /> : <></>}
    </>
  );
}

export default Contests;
