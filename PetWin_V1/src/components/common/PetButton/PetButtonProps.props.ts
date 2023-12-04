import { StaticImageData } from 'next/image';

export interface PetButtonProps {
  name?: string;
  imageSource?: StaticImageData | string;
  participantId ?: string;
}
