import { StaticImageData } from 'next/image';

export interface ContestsImageProps {
  imageSource: StaticImageData | string;
  date: string;
  name: string;
  prize: string;
  contestants: string;
  buttonSource?: string;
  viewWinners?: boolean;
  isFinished?: boolean;
  trophy?: {
    name: string;
    prize: string;
  };
  columns?: number;
}
