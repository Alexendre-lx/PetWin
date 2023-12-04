import Image from 'next/image';
import { PetButtonProps } from './PetButtonProps.props';
import styles from './petButton.module.scss';
import Link from 'next/link';

function PetButton({ name, imageSource, participantId}: PetButtonProps) {
  return (
    <div className="d-flex justify-content-center flex-column align-items-center gap-2">
      <button className={styles.PetButtonImage}>
        <Link href={`/contestants/${participantId}`}>
          <Image src={imageSource!} alt={name!} width={50} height={50}/>
        </Link>
      </button>

      <div className={styles.PetButtonInfo}>{name}</div>
    </div>
  );
}

export default PetButton;
