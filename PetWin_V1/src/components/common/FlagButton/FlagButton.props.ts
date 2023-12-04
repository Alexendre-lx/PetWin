import { StaticImageData } from 'next/image';

export interface FlagButtonProps {
  country: string;
  imageSource: StaticImageData;
  onClick: (country: string) => void;
  active: boolean;
}
