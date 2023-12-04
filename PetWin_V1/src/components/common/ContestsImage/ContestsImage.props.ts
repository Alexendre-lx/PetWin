import { StaticImageData } from 'next/image';

export interface ContestsImageProps {
  imageSource: StaticImageData | string;
  date: string;
  name: string;
  prize: string;
  contestants: string;
  buttonSource?: string;
  containerLink?: string;
  lgColumns?: number;
  isFinished?: boolean;
  dateTransparent?: boolean;
  trophy?: {
    name: string;
    prize: string;
  };
  columns?: number;
}
