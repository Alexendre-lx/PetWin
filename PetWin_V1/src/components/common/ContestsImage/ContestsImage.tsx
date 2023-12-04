import Trophy from '@petwin/icons/trophy';
import { ContestsImageProps } from './ContestsImage.props';
import styles from './contestsItem.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from '../Button/Button';
import Arrow from '@petwin/icons/arrow';
import cn from 'classnames';

function ContestsImage({
  imageSource,
  date,
  name,
  contestants,
  prize,
  buttonSource,
  trophy,
  columns,
  containerLink,
  isFinished,
  dateTransparent,
  lgColumns = 6,
}: ContestsImageProps) {
  const router = useRouter();

  function goTo() {
    buttonSource && router.push(`/${buttonSource}`);
    containerLink && router.push(`/${containerLink}`);
  }

  return (
    <div
      className={cn(
        `col-xl-${lgColumns} col-${columns} position-relative px-2 p-md-4`,
        styles.contestsImageContainer
      )}
    >
      <div
        className={cn(
          styles.darkenImageContainer,
          !columns && styles.BigImageContainer,
          'cursor-pointer'
        )}
        onClick={goTo}
      >
        {isFinished && <div className={styles.Finished}>TERMINÉ</div>}
        <Image
          src={imageSource}
          width={1000}
          height={1000}
          alt="dog"
          className="w-100"
        />
      </div>
      {trophy ? (
        <div
          className={cn(
            'position-absolute top-0 right-0',
            styles.contestsTrophyContainer
          )}
        >
          <Trophy />
          <h5 className="m-auto">{trophy?.name}</h5>
          <p className="m-auto">{trophy?.prize} €</p>
        </div>
      ) : (
        <></>
      )}
      <div
        className={cn(
          styles.contestsBottomLabel,
          'position-absolute bottom-0 z-2 gap-md-3 gap-1 p-0 p-md-3 mb-md-5 mb-3 pt-3',
          columns ? 'left-0 right-0 p-0 m-0' : ''
        )}
      >
        <div
          className={cn(
            styles.contestsBottomLabelDate,
            columns && 'm-auto',
            dateTransparent && styles.DateTransparent
          )}
        >
          <p className="p-2 p-md-3">{date}</p>
        </div>
        <div className={cn(columns ? 'm-auto' : '')}>
          <h3>{name}</h3>
        </div>
        <div
          className={cn(
            'd-md-flex flex-md-row flex-column gap-md-2',
            columns && 'm-auto'
          )}
        >
          <p className="md:!text-[20px]">{prize} € -</p>
          <p className="md:!text-[20px]">{contestants} Participants</p>
        </div>
        {buttonSource ? (
          <div className="d-none d-md-block">
            <Button
              orange
              source={buttonSource}
              label="Voir Le Concours"
              icon={<Arrow />}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default ContestsImage;
