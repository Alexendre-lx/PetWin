import { StaticImageData } from 'next/image';

export type RegisterToWinProps = {
  right?: boolean;
  src: string | StaticImageData;
  content: string;
  dogIcon?: boolean;
};
