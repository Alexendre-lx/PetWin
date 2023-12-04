import styles from './participant.module.scss';
import Button from '../Button/Button';
import { ParticipantProps } from './participant.props';
import Eye from '@petwin/icons/eye';
import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

function Participant({ participant }: ParticipantProps) {
  const maxSymbols = 140;

  return (
    <div
      key={participant.id}
      className={cn(styles.ParticipantContainer, 'pb-3 pb-md-5')}
    >
      <div>
        <h2 className="text-start">Nouveau Participant</h2>
      </div>
      <div className={cn('position-relative', styles.ParticipantImage)}>
        <Link href={`/contestants/${participant.id}`}>
          <Image
            src={participant.pictureURL}
            alt={participant.name}
            width={200}
            height={200}
          />
        </Link>
      </div>
      <div>
        <div className="d-flex flex-row gap-3 align-items-center mt-3">
          <h4 className={styles.ParticipantName}>{participant.name}</h4>
              <span className="text-2xl">-</span>{' '}
              <span>{participant.votes} votes</span>
  
        </div>
        <div>
          {participant.description && (
            <>{participant.description.slice(0, maxSymbols) + '...'}</>
          )}
        </div>      </div>
      <div className="d-flex justify-content-center  align-items-center mt-4">
        <Button
          source={`/contestants/${participant.id}`}
          label="Voir le profil "
          className="px-5 py-3"
          icon={<Eye />}
        />
      </div>
    </div>
  );
}

export default Participant;
