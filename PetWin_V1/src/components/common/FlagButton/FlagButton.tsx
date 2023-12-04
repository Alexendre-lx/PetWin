import Image from 'next/image';
import styles from './FlagButton.module.scss';
import { FlagButtonProps } from './FlagButton.props';
import cn from 'classnames';

function FlagButton({
  country,
  imageSource,
  onClick,
  active,
}: FlagButtonProps) {
  return (
    <button
      className={cn(styles.flagButton, active && styles.active)}
      onClick={() => onClick(country)}
    >
      <Image src={imageSource} alt={country} width={100} height={100} />
      {country}
    </button>
  );
}

export default FlagButton;
