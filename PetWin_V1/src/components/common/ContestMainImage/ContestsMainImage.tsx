import { ContestsImageProps } from './ContestsMainImage.props';
import styles from './contestsMainItem.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from '../Button/Button';
import Arrow from '@petwin/icons/arrow';
import cn from 'classnames';

function ContestMainImage({
  imageSource,
  date,
  name,
  contestants,
  buttonSource,
  trophy,
  viewWinners,
  isFinished,
  prize
}: ContestsImageProps) {
  const router = useRouter();

  function goTo() {
    buttonSource && router.push(`/${buttonSource}`);
  }
  return (
    <div
      className={cn('col-12 col-xl-6', styles.ContestContainer)}
      onClick={goTo}
    >
      <div className={cn(styles.ImageWrapper)}>
        {isFinished && <div className={styles.FinishedWrapper}>TERMINÉ</div>}
        <Image src={imageSource} alt={name} width={300} height={300}/>
      </div>
      <div className="pb-3">
        <div className={cn(styles.ContestInfo, 'mb-2')}>
          <div className={cn(styles.Date)}>{date}</div>
          <div className={cn(styles.Name)}>{name}</div>
          <div className={cn(styles.Prize)}>
            {trophy?.name && `${trophy?.name}:`}{' '}
            {trophy?.prize && <span>{trophy?.prize ? trophy?.prize :prize } € -</span>} {contestants} participants
          </div>
        </div>
        <Button
          className="px-5"
          label={viewWinners ? 'Voir Les Gagnants' : 'Voir Les Concours'}
          icon={<Arrow />}
          orange
        />
      </div>
    </div>
  );
}

export default ContestMainImage;
