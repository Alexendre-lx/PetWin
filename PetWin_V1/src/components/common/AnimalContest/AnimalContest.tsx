import Image, { StaticImageData } from 'next/image';
import dogLabel from '@petwin/images/dogContestLabel.png';
import ChoiceButton from '@petwin/components/common/ChoiceButton/ChoiceButton';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import ContestGridList from '../../ContestGridList/ContestGridList';
import styles from './animalContest.module.scss';
import Button from '../Button/Button';
import Arrow from '@petwin/icons/arrow';
import albania from '@petwin/images/flags/albania.png';
import afghanistan from '@petwin/images/flags/afghanistan.png';
import moldova from '@petwin/images/flags/moldova.png';
import belgium from '@petwin/images/flags/belgium.png';
import azerbaijan from '@petwin/images/flags/azerbaijan.png';
import FlagButton from '../FlagButton/FlagButton';
import { AnimalContestProps } from './AnimalContest.props';
import Prizes from '../Prizes/Prizes';
import cn from 'classnames';
import PetButton from '../PetButton/PetButton';
import SortModal from '../SortModal/SortModal';
import SearchContest from '../SearchContest/SearchContest';
import Container from '@petwin/components/common/Container/Container';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import { ContestGridListProps } from '@petwin/components/ContestGridList/ContestGridProps.props';
import { useRouter } from 'next/router';
import { Loader } from '../Loader/Loader';
import ErreurComponent from '@petwin/components/Error/Error';
import axios from 'axios';

interface MyParticipant {
  alreadyParticipates: boolean;
  myParticipant?: {
    name: string;
    imageSource: string;
    participantId: string;
  }
}

function AnimalContest({

  contestData,

}: AnimalContestProps) {


  const router = useRouter();
  const contestId = router.query.contestId as string;
  const { currentUser } = useContext(UserContext) as UserContextType;



  const flagArr = useMemo(() => [
    {
      key: 'auvergne-rhone-alpes',
      imageSource: moldova,
      region: 'Auvergne-Rhône-Alpes',
    },
    {
      key: 'bourgogne-franche-comte',
      imageSource: belgium,
      region: 'Bourgogne-Franche-Comté',
    },
    {
      key: 'bretagne',
      imageSource: azerbaijan,
      region: 'Bretagne',
    },
    {
      key: 'centre-val-de-loire',
      imageSource: afghanistan,
      region: 'Centre-Val de Loire',
    },
    {
      key: 'corse',
      imageSource: albania,
      region: 'Corse',
    },
    {
      key: 'grand-est',
      imageSource: moldova,
      region: 'Grand Est',
    },
    {
      key: 'hauts-de-france',
      imageSource: belgium,
      region: 'Hauts-de-France',
    },
    {
      key: 'ile-de-france',
      imageSource: azerbaijan,
      region: 'Île-de-France',
    },
    {
      key: 'normandie',
      imageSource: afghanistan,
      region: 'Normandie',
    },
    {
      key: 'nouvelle-aquitaine',
      imageSource: albania,
      region: 'Nouvelle-Aquitaine',
    },
    {
      key: 'occitanie',
      imageSource: moldova,
      region: 'Occitanie',
    },
    {
      key: 'pays-de-la-loire',
      imageSource: belgium,
      region: 'Pays de la Loire',
    },
    {
      key: 'provence-alpes-cote-d-azur',
      imageSource: azerbaijan,
      region: 'Provence-Alpes-Côte d\'Azur',
    },
    {
      key: 'outre-mer',
      imageSource: afghanistan,
      region: 'Outre-Mer',
    },
    {
      key: 'canada',
      imageSource: albania,
      region: 'Canada',
    },
    {
      key: 'belgique',
      imageSource: moldova,
      region: 'Belgique',
    },
    {
      key: 'suisse',
      imageSource: belgium,
      region: 'Suisse',
    },
  ], []);

  const prizeData = [
    {
      imageSource: moldova,
      key: 'auvergne-rhone-alpes',
      value: 'Auvergne-Rhône-Alpes',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: belgium,
      key: 'bourgogne-franche-comte',
      value: 'Bourgogne-Franche-Comté',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: azerbaijan,
      key: 'bretagne',
      value: 'Bretagne',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: afghanistan,
      key: 'centre-val-de-loire',
      value: 'Centre-Val de Loire',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'corse',
      value: 'Corse',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'grand-est',
      value: 'Grand Est',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'hauts-de-france',
      value: 'Hauts-de-France',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'ile-de-france',
      value: 'Île-de-France',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'normandie',
      value: 'Normandie',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'nouvelle-aquitaine',
      value: 'Nouvelle-Aquitaine',
      goldenVotes: 1500,
      silverVotes: 1000,
      bronzeVotes: 500,
    },
    {
      imageSource: albania,
      key: 'occitanie',
      value: 'Occitanie',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'corse',
      value: 'Corse',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'pays-de-la-loire',
      value: 'Pays de la Loire',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'provence-alpes-cote-d-azur',
      value: 'Provence-Alpes-Côte d\'Azur',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'outre-mer',
      value: 'Outre-Mer',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'canada',
      value: 'Canada',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
    {
      imageSource: albania,
      key: 'belgique',
      value: 'Belgique',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    }, {
      imageSource: albania,
      key: 'suisse',
      value: 'Suisse',
      goldenVotes: 200,
      silverVotes: 100,
      bronzeVotes: 50,
    },
  ];

  const [selected, setSelected] = useState<string>('Monde');
  const [flagSelected, setFlagSelected] = useState<string>(flagArr[0].key);
  const [scrollY, setScrollY] = useState(0);
  const [sortedBy, setSortedBy] = useState<string>('Recents');

  const [alreadyParticipates, setAlreadyParticipates] = useState<MyParticipant>();
  const [isLoadingParticipants, setIsLoadingAlreadyParticipates] = useState<boolean>(true);
  const [isErrorParticipants, setIsErrorAlreadyParticipates] = useState<boolean>(false);

  const [participatesDataByRegion, setParticipatesDataByRegion] = useState<ContestGridListProps[]>([]);
  const [isLoadingDataByRegion, setIsLoadingDataByRegion] = useState<boolean>(true);
  const [isErrorDataByRegion, setIsErrorDataByRegion] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [lastItemId, setLastItemId] = useState<string>('');

  const [participantsData, setParticipantsData] = useState<ContestGridListProps[]>([]);
  const [isLoadingParticipantsData, setIsLoadingParticipantsData] = useState<boolean>(true);
  const [isErrorParticipantsData, setIsErrorParticipantsData] = useState<boolean>(false);
  const [hasNextPageParticipantsData, setHasNextPageParticipantsData] = useState<boolean>(false)
  const [lastItemIdParticipantsData, setLastItemIdParticipantsData] = useState<string>('');

  const fetchAlreadyParticipates = async () => {
    console.log(isLoadingDataByRegion)
    try {
      const response = await axios.get(`http://localhost:8080/api/contests/already-participates?ownerId=${currentUser?.uid}`);
      setAlreadyParticipates(response.data);
      setIsLoadingAlreadyParticipates(false);
    } catch (error) {
      setIsErrorAlreadyParticipates(true);
    }
  };

  const fetchParticipantsDataByRegion = async (lastItemId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/contests/participantsByRegion?contestId=${contestId}&region=${flagSelected}&limit=8&orderBy=${sortedBy}&lastItemId${lastItemId}`);
      setParticipatesDataByRegion((prevParticipants) => {
        return prevParticipants ? [...prevParticipants, ...response.data.sortedParticipants] : response.data.sortedParticipants
      })
      setHasNextPage(response.data.hasNextPage)
      setLastItemId(response.data.sortedParticipants.length !== 0 ? response.data.sortedParticipants[response.data.sortedParticipants.length - 1].id : '')
      setIsLoadingDataByRegion(false)

    } catch (error) {
      setIsErrorDataByRegion(true)
    }
  }

  const fetchParticipantsData = async (lastItemIdParticipatesData: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/contests/participants?contestId=${contestId}&limit=6&orderBy=${sortedBy}&lastItemId=${lastItemIdParticipatesData}`);
      setParticipantsData((prevParticipants) => {
        return prevParticipants ? [...prevParticipants, ...response.data.sortedParticipants] : response.data.sortedParticipants
      })
      setHasNextPageParticipantsData(response.data.hasNextPage)
      setLastItemIdParticipantsData(response.data.hasNextPage ? response.data.sortedParticipants[response.data.sortedParticipants.length - 1].id : '')
      setIsLoadingParticipantsData(false)
    } catch (error) {
      setIsErrorParticipantsData(true)
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
    setParticipantsData([])
    fetchParticipantsData('');
  }, [sortedBy]);

  useEffect(() => {
    setParticipatesDataByRegion([])
    fetchParticipantsDataByRegion('');
  }, [sortedBy, flagSelected]);

  useEffect(() => {
    if (currentUser) { fetchAlreadyParticipates(); }
    else {
      setIsLoadingAlreadyParticipates(false)
    }
  }, [currentUser])

  const fetchAllData = () => {
    if (currentUser) fetchAlreadyParticipates();
    fetchParticipantsDataByRegion('');
    fetchParticipantsData('')
  }

  if (isLoadingParticipants) return <Loader />;
  if (isErrorParticipants || isErrorDataByRegion || isErrorParticipantsData) return <ErreurComponent onRetry={fetchAllData} />;

  function handleSelected(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const buttonElement = event.target as HTMLButtonElement;
    setSelected(buttonElement.innerHTML);
  }

  function flagButtonHandle(region: string) {
    setFlagSelected(region);
  }

  function handlePrizeOnClick(region: string) {
    setSelected('Region');
    setFlagSelected(region);
  }

  function handleSortSelect(sort: string) {
    setSortedBy(sort);
  }

  const sliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 10,
    responsive: [
      {
        breakpoint: 320,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 550,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 6 },
      },
      {
        breakpoint: 1042,
        settings: { slidesToShow: 5 },
      },
    ],
  };

  return (
    <Container
      className={cn(
        styles.dogContestContainer,
        'd-flex flex-column justify-content-center align-items-center'
      )}
    >
      <div className="position-relative w-full">
        <div
          className={cn(
            'd-flex flex-row py-2 py-md-0 px-0 px-md-0 mb-3',
            styles.NewContestContainer
          )}
        >
          <div className={styles.NewContestAvatar}>
            <Image src={dogLabel} alt="pet" />
          </div>
          <div className={styles.NewContestInfo}>
            <h3>{contestData.name}</h3>
            <div className={styles.NewContestDate}>
              <p>{contestData.date2.formattedDate}</p>
            </div>
            <div className={styles.NewContestDate}>
              <span>{contestData.date2.daysLeft}</span>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-center ml-auto gap-1 gap-md-3">
            <SortModal handleSort={handleSortSelect} selectedSort={sortedBy} />

            <SearchContest />
          </div>
        </div>
        <div className="px-2 pt-3 ">
          <div className={cn('d-flex gap-3 pb-2', styles.buttonContainer)}>
            <ChoiceButton active={selected == 'Monde'} onClick={handleSelected}>
              Monde
            </ChoiceButton>
            <ChoiceButton
              active={selected == 'Région'}
              onClick={handleSelected}
            >
              Région
            </ChoiceButton>
            <ChoiceButton
              active={selected == 'Récompenses'}
              onClick={handleSelected}
            >
              Récompenses
            </ChoiceButton>
          </div>
          <div className={styles.ContestParticipants}>
            <span>{contestData.participants}</span> participants -{' '}
            <span>{contestData.amountToWin}€</span> à gagner
          </div>
          {selected == 'Région' && (
            <>
              <div className={styles.FlagsWrapper}>
                {flagArr.map((country) => (

                  <FlagButton
                    key={country.region}
                    active={flagSelected == country.key}
                    country={country.key}
                    imageSource={country.imageSource}
                    onClick={flagButtonHandle}
                  />
                ))}
              </div>

              {!isLoadingDataByRegion ? (
                participatesDataByRegion?.length === 0 ? (
                  <div
                    className={cn(
                      'row d-flex justify-content-center text-center pt-40',
                      styles.ContestsText
                    )}
                  >
                    <h2>Aucun participant de cette région </h2>
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={participatesDataByRegion.length || 0}
                    next={() => fetchParticipantsDataByRegion(lastItemId)}
                    hasMore={hasNextPage}
                    loader={<Loader />}
                  >
                    {participatesDataByRegion && (
                      <ContestGridList contestData={participatesDataByRegion} />
                    )}
                  </InfiniteScroll>
                )) : (
                <Loader />
              )

              }
            </>
          )}
          {selected == 'Récompenses' && (

            isLoadingDataByRegion ?
              (
                <Loader />
              ) :
              (
                <Prizes
                  prizesData={prizeData}
                  handlePrizeOnClick={handlePrizeOnClick}
                  prizeWorld={contestData.prize}
                  prizeVotesWorld={contestData.prizeVotes}
                />
              )
          )}
          {selected == 'Monde' && (
            <>
              {isLoadingParticipantsData ? (

                <Loader />
              ) : (
                <InfiniteScroll
                  dataLength={participantsData.length || 0}
                  next={() => fetchParticipantsData(lastItemIdParticipantsData)}
                  hasMore={hasNextPageParticipantsData}
                  loader={<Loader />}

                >
                  <ContestGridList contestData={participantsData} />
                </InfiniteScroll>
              )}

              <div
                className={cn(
                  styles.StickyButtonWrapper,
                  scrollY > 200 ? 'd-block' : 'd-none'
                )}
              >
                {alreadyParticipates?.alreadyParticipates ? (
                  <PetButton
                    name={alreadyParticipates.myParticipant?.name}
                    imageSource={alreadyParticipates.myParticipant?.imageSource}
                    participantId={alreadyParticipates.myParticipant?.participantId}
                  />
                ) : (
                  <Button
                    className="m-auto"
                    label="participer"
                    orange
                    source='/participate'
                    icon={<Arrow />}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <div
          className={cn(
            'justify-content-center py-3 pb-5',
            selected != 'Récompenses' ? 'd-flex' : 'd-none'
          )}
        >
          {/* <Button source="#" label="Load more" orange icon={<Arrow down />} /> */}
        </div>
      </div >
    </Container >
  );
}

export default AnimalContest;


