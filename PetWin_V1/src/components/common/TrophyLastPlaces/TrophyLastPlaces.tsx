import PrizeArrow from '@petwin/icons/prizeArrow';
import styles from '../Prizes/prizes.module.scss';
import cn from 'classnames';
import { TrophyLastPlacesProps } from '@petwin/components/common/TrophyLastPlaces/TrophyLastPlaces.props';

function TrophyLastPlaces({ place, prize }: TrophyLastPlacesProps) {
  return (
    <div
      className={cn(
        'col-8 d-flex flex-row py-0 justify-content-between m-auto',
        styles.trophyLastPlacesContainer
      )}
    >
      <h4 className="text-2xl m-0">{place}</h4>
      <span className="text-2xl">
        <PrizeArrow />
      </span>
      <h5>{prize}€</h5>
    </div>
  );
}

export default TrophyLastPlaces;
