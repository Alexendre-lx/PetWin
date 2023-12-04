import Image from 'next/image';
import styles from './latestVote.module.scss';
import cn from 'classnames';
import { LatestVoteCardProps } from '@petwin/components/common/LatestVote/LatestVote.props';
import userAvatar from '@petwin/images/userAvatar.png';

function LatestVoteCard ({
  orange,
  voted_for,
  name,
  timestamp,
  id,
  avatar,
}: LatestVoteCardProps) {
  return (
    <div
      className={cn(
        styles.LatestVoteCardContainer,
        orange && styles.OrangeCard
      )}
    >
      <div className={styles.LatestVoteCardImageContainer}>
        <div className={styles.LatestVoteCardImage}>
          <Image src={avatar} width={25} height={25} alt="avatar" />
        </div>
      </div>
      <div className={styles.LatestVoteCardInfoContainer}>
        <div className={styles.LatestVoteCardBadge}>{timestamp}</div>
        <div className={styles.LatestVoteCardName}>{name}</div>
        <div className={styles.LatestVoteCardVoted}>a voté pour {voted_for}</div>
      </div>
    </div>
  );
}

export default LatestVoteCard;
