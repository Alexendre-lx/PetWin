import Trophy from '@petwin/icons/trophy';
import styles from './contestantSliderItem.module.scss';
import Image from 'next/image';
import { ContestantSliderItemProps } from './ContestantSliderItemProps.props';

import { useRouter } from 'next/router';


function ContestantSliderItem({userPicture, participantPicture, byName, name, vote, participantId}: ContestantSliderItemProps) {
  const router = useRouter();

  const goTo=() => {
router.push(`/contestants/${participantId}`)
  }

  return (
    <div className={styles.SliderItemContainer} onClick={goTo}>
      <div className={styles.SliderItemImage}>
        <div className={styles.SliderItemOverlay}></div>
        <Image src={participantPicture} alt={name} width={50} height={100} />
      </div>
      <div className={styles.SliderItemInfoContainer}>
        <div className={styles.SliderItemInfoImage}>
          <Image src={userPicture} alt={byName} width={50} height={50} />
        </div>
        <h4 className={styles.SliderItemInfoName}>{name}</h4>
        <p className={styles.SliderItemInfoByName}> de {byName}</p>
        <div className={styles.SliderItemInfoVote}>
          <Trophy />
          {vote + ' votes'}
        </div>
      </div>
    </div>
  );
}

export default ContestantSliderItem;
