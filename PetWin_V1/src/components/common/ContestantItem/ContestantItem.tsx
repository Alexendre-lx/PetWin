import styles from './contestantItem.module.scss';
import Image from 'next/image';
import participantAvatar from '@petwin/images/participant.png';
import Trophy from '@petwin/icons/trophy';
import { useRouter } from 'next/router';
import { ContestantItemProps } from '@petwin/components/common/ContestantItem/ContestantItem.props';
import { getOrdinalEnding } from '@petwin/utils/getOrdinalEnding';

const ContestantItem = ({
  contestant,
}: {
  contestant: ContestantItemProps;
}) => {
  const router = useRouter();

  const goToContestant = (id: string) => {
    router.push(`/contestants/${id}`);
  };
  return (
    <div
      className={styles.ContestantItem}
      onClick={() => goToContestant(contestant.id)}
    >
      <div className={styles.SearchAvatar}>
        <Image src={contestant.pictureURL} width={50} height={50} alt={`avatar-${contestant.name}`} />
      </div>
      <div className={styles.ContestantInfo}>
        <div className={styles.MainInfo}>
          {contestant.place <= 3 && (
            <Trophy
              silver={contestant.place === 2}
              bronze={contestant.place === 3}
            />
          )}
          <div className={styles.Name}>{contestant.name}</div>
        </div>
        <div className={styles.AdditionalInfo}>
          <div>{getOrdinalEnding(contestant.place)}</div>
          <div>{contestant.votes} votes</div>
          <div>{contestant.owner_name}</div>
        </div>
      </div>
    </div>
  );
};

export default ContestantItem;
