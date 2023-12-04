import Trophy from '@petwin/icons/trophy';
import Image from 'next/image';
import styles from './contestGridImages.module.scss';
import { ContestGridProps } from './ContestGridImages.props';
import cn from 'classnames';
import { useRouter } from 'next/router';


function ContestGridImages({
  contestGridData: {
    imageSource,
    place,
    name,
    totalVotes,
    prize,
    id,
    prizeVotes,
    col,
    xsCol,

  },
}: ContestGridProps) {
  const router = useRouter();

  function goTo() {
    router.push(`/contestants/${id}`);
  }


  return (
    <div
      key={id}
      onClick={goTo}
      id={name}
      className={cn(
        `col-${xsCol ? xsCol : col} parent m-0 p-1 p-md-2 col-lg-${col}`,
        styles.gridImageContainer
      )}
    >
      <div className="position-relative cursor-pointer">
        <div className={styles.darkenImageContainer}>
          <Image
            src={imageSource}
            height={200}
            width={200}
            alt="A picture of pet"
            className={styles.darkenImage}
          />
        </div>
        <div
          className={cn(
            'position-absolute bottom-0 left-0 z-2 m-2 m-md-3 pl-2',
            styles.gridImageInfo
          )}
        >
          <h4>{name}</h4>
          <div className="d-flex gap-1">
            <Trophy />
            <p>{place} | </p> <p>{totalVotes} votes</p>
          </div>
          <h3>
            {prize}$ - {prizeVotes} votes
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ContestGridImages;
