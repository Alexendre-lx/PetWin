import styles from './userVoteBalanceModal.module.scss';
import { Modal } from 'react-bootstrap';
import Image from 'next/image';
import userAvatar from '@petwin/images/userAvatar.png';
import cn from 'classnames';
import Button from '@petwin/components/common/Button/Button';
import SmallHeart from '@petwin/icons/smallHeart';
import OrangeHeard from '@petwin/icons/orangeHeard';
import RedHeard from '@petwin/icons/redHeard';
import BlueHeart from '@petwin/icons/blueHeard';
import { UserVoteBalanceModalProps } from '@petwin/components/common/UserVoteBalanceModal/UserVoteBalanceModal.props';
import { useRouter } from 'next/router';
import { UserContext, UserContextType } from '@petwin/context/userContext';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';


const votesPrice = [
  {
    id: 0,
    priceId: 'price_1OFuQfHJ6LFTygo1gnguqCkM',
    votes: 1,
    price: 0,
  },
  {
    id : 1,
    priceId: 'price_1OFuQfHJ6LFTygo1gnguqCkM',
    votes: 150,
    price: 3,
  },
  {
    id : 2,
    priceId: 'price_1OFxLAHJ6LFTygo1Cr4EASz6',
    votes: 400,
    price: 6,
  },
  {
    id : 3,
    priceId: 'price_1OFySKHJ6LFTygo1t5NmxFAl',
    votes: 1000,
    price: 9.9,
  },
  {
    id : 4,
    priceId: 'price_1OFySsHJ6LFTygo1Ym0W36yE',
    votes: 2200,
    price: 19.9,
  },
  {
    id : 5,
    priceId: 'price_1OFyTQHJ6LFTygo1L9nJQW9D',
    votes: 5000,
    price: 39.9,
  },
  {
    id : 6,
    priceId: 'price_1OFyTxHJ6LFTygo1AeRZl8lZ',
    votes: 10000,
    price: 74.9,
  },
  {
    id : 7,
    priceId: 'price_1OFyUWHJ6LFTygo1UOiSoS0s',
    votes: 20000,
    price: 139.9,
  },
  {
    id : 8,
    priceId: 'price_1OFyUyHJ6LFTygo1p7mrgZVT',
    votes: 40000,
    price: 278.9,
  },
];

const UserVoteBalanceModal = ({
  openModal,
  handleClose,
  modalSelected,
  handleModalSelect,
  showBalance,
  participantData
}: UserVoteBalanceModalProps) => {
  const router = useRouter();
  const participantId = router.query.participantId as string;

  const { getUserToken, currentUser } = useContext(UserContext) as UserContextType;

  const [userToken, setUserToken] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const userToken = await getUserToken(currentUser);
        setUserToken(userToken)
      }
    };
  
    fetchData();
  }, [currentUser]); 

  const handleButtonClick = async (priceId : string, votes : number) => {
    if (currentUser && participantId) {
    try {
      const response = await axios.get(`http://localhost:8080/api/stripe/getCheckoutUrl?userId=${currentUser?.uid}&priceId=${priceId}&participantId=${participantId}&votes=${votes}&contestId=${participantData?.contestIdInProgress}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken,
        },
      });
      router.push(response.data.url);
    } catch (error) {
      setIsError(true)    
    }
  }
  };

  if (isError) handleClose;
  return (
    <Modal
      show={openModal}
      onHide={handleClose}
      centered
      className={styles.Modal}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title className={styles.ModalTitle}>
          <div>
            <div className={styles.Avatar}>
              <Image
                src={participantData?.mainPhoto!}
                alt={'avatar'}
                width={100}
                height={50}
                className="ratio ratio-1x1"
              />
            </div>
            <div className={styles.Name}>{participantData?.name}</div>
          </div>
          <div className={cn(styles.Ranking)}>
            <div>
              <div>{participantData?.awards[0].place}</div>
              <div className={styles.RankingCategory}>{participantData?.specie}</div>
            </div>
            <div>
              <div>{participantData?.awards[1].place}</div>
              <div className={styles.RankingCategory}>{participantData?.location}</div>
            </div>
            <div>
              <div>{participantData?.awards[2].place}</div>
              <div className={styles.RankingCategory}>{participantData?.awards[2].name}</div>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <div className={cn('row p-0 m-0', styles.ModalSelectWrapper)}>
        <div
          className={cn(
            'col-4',
            styles.ModalSelect,
            modalSelected === 'Votes' && styles.ModalSelectActive
          )}
          onClick={() => handleModalSelect('Votes')}
        >
          Votes
        </div>
        <div
          className={cn(
            'col-4',
            styles.ModalSelect,
            modalSelected === 'Badges' && styles.ModalSelectActive
          )}
          onClick={() => handleModalSelect('Badges')}
        >
          Badges
        </div>
        <div
          className={cn(
            'col-4',
            styles.ModalSelect,
            modalSelected === 'Codes' && styles.ModalSelectActive
          )}
          onClick={() => handleModalSelect('Codes')}
        >
          Codes
        </div>
      </div>
      <Modal.Body>
        {participantData?.isRegistered ?
          
            showBalance?(
          <>
            <div className={styles.BalanceWrapper}>
              <div className={styles.Amount}>000</div>
              <div className={styles.Balance}>Balance</div>
            </div>
            <div className={styles.NotEnough}>Not enough credit</div>
            <div className={styles.ButtonWrapper}>
              <Button md orange label={'recharge voting balance'} />
            </div>
          </>
      ) : (
      <>
        {votesPrice.map((item) => (
          <div className={styles.VoteItem} key={item.id}>
            <div className={styles.VoteCount}>
              {item.id <= 3 ? (
                <SmallHeart />
              ) : item.id === 4 ? (
                <OrangeHeard />
              ) : item.id === 5 ? (
                <RedHeard />
              ) : (
                <BlueHeart />
              )}
              <span>{item.votes} Vote</span>
            </div>
            {item.price === 0 ? (
              <Button
                md
                label={'Free'}
                //onClick={() => handleButtonClick(item.priceId, item.votes)}
                className={styles.Button}
              />
            ) : (
              <Button
                md
                orange
                label={`${item.price}`}
                onClick={() => handleButtonClick(item.priceId, item.votes)}
                className={styles.Button}
              />
            )}
          </div>
        ))}
      </>
        ) : 
              <p> ce chien n'est pas inscrit</p>
      }
      <div className={styles.Subscribe}>
        <div>Get monthly FREE vote and reduction</div>
        <button>Subscribe Now</button>
      </div>
      <div className={styles.NeedHelp}>Need help?</div>
    </Modal.Body>
    </Modal >
  );
};

export default UserVoteBalanceModal;
