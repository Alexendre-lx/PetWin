import Image from 'next/image';
import { FeaturedGridItemProps } from './FeaturedGridItemProps.props';
import cn from 'classnames';
import styles from './featuredGridItem.module.scss';
import Trophy from '@petwin/icons/trophy';
import { useRouter } from 'next/router';

function FeaturedGridItem({
  featuredGridItem,
}: {
  featuredGridItem: FeaturedGridItemProps;
}) {
  const { id, name, xsCol, col, imageSource, totalVotes, prize, prizeVotes, place, isRegistered } = featuredGridItem;

  const router = useRouter();

  function goTo() {
    router.push(`/contestants/${id}`);
  }
  return (
    <div
      className={cn(
        `col-${xsCol} col-xl-${col} position-relative`,
        styles.FeaturedContainer,
      )}
      onClick={goTo}
    >
      <div className={styles.DarkenImage}>
        <Image src={imageSource} width={250} height={250} alt={name} />
      </div>
      <div
        className={cn(
          'position-absolute bottom-0 left-0 z-2 m-3 m-md-4',
          styles.FeaturedImageInfo
        )}
      >
        <h4>{name}</h4>
        <div className="d-flex gap-1">
          {isRegistered ? (
            <>
              <Trophy />
              <p>{place} |</p> <p>{totalVotes}</p>
            </>
          ) : (
            <p>Is note registered</p>
          )}

        </div>
        {isRegistered && (
          <h3>
            {prize} - {prizeVotes}
          </h3>
        )}

      </div>
    </div>
  );
}

export default FeaturedGridItem;
