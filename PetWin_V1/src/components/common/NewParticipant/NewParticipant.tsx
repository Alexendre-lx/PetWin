import styles from './newParticipant.module.scss';
import Participant from '../Participant/Participant';
import Arrow from '@petwin/icons/arrow';
import Button from '@petwin/components/common/Button/Button';
import cn from 'classnames';
import ParticipantIcon from '@petwin/icons/participantIcon';
import { useEffect, useState } from 'react';
import { NewParticipantProps } from './NewParticipant.props';
import { useRouter } from 'next/router';
import Container from '@petwin/components/common/Container/Container';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from '../Loader/Loader';


function NewParticipant({ participantsList, loadMoreData, hasMore }: NewParticipantProps) {
  const router = useRouter();
  const { route } = router;

  const isShowAllParticipants = route === '/new-participants';
  const displayedParticipants = isShowAllParticipants
    ? participantsList
    : participantsList.slice(0, 3);

  return (
    <Container className={cn(styles.NewParticipantContainer)}>
      <div className="row d-flex justify-content-center mb-6">
        <div className="pt-3 d-flex flex-column align-items-center justify-content-end">
          <ParticipantIcon />
          <h2 className={cn('pt-2 pt-md-6', styles.NewParticipantTitle)}>
            NOUVEAUX PARTICIPANTS
          </h2>
          <h4
            className={cn(
              'text-center',
              isShowAllParticipants ? 'd-block' : 'd-none'
            )}
          >
            Votez pour votre animal préfère et aidez le à obtenir la 1er place
          </h4>
        </div>
      </div>
      <div className="row gap-y-4 mb-5">
        {!loadMoreData ? (
          displayedParticipants.map((participant) => (
            <div className="col-12 col-sm-6 col-xl-4" key={participant.id}>
              <Participant participant={participant} />
            </div>
          ))
        ) : (
          <InfiniteScroll
            dataLength={displayedParticipants ? displayedParticipants.length : 0}
            next={loadMoreData}
            hasMore={hasMore || false}
            loader={<Loader />}
          >
            {displayedParticipants?.map((participant) => (
              <div className="col-12 col-sm-6 col-xl-4" key={participant.id}>
                <Participant participant={participant} />
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
      <div className={cn(isShowAllParticipants ? 'd-none' : 'd-block', 'pb-0')}>
        <div className="d-md-none d-flex justify-content-center pb-4 pb-md-5 mb-md-3 mb-0 text-nowrap">
          <Button
            label="Voir tous les participants"
            source={'/new-participants'}
            icon={<Arrow />}
            orange
            big
          />
        </div>
        <div className="d-none d-md-flex justify-content-center pb-4 pb-md-5 mb-md-3 mb-0 text-nowrap">
          <Button
            label="Voir tous les participants"
            source={'/new-participants'}
            icon={<Arrow />}
            orange
            big
          />
        </div>
      </div>
      <div
        className={cn(
          'justify-content-center pb-10 text-nowrap',
          isShowAllParticipants ? ' d-flex' : ' d-none'
        )}
      >
        {hasMore && (
          <Button
            label="Voir plus"
            icon={<Arrow down />}
            orange
            onClick={loadMoreData} />
        )}

      </div>
    </Container>
  );
}

export default NewParticipant;
