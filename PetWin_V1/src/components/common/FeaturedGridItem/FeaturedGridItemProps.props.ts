import { StaticImageData } from 'next/image';

export interface FeaturedGridItemProps {
  imageSource: StaticImageData| string;
  name: string;
  place: string | number;
  totalVotes: number | string;
  prize: number;
  prizeVotes: number | string;
  id: number | string;
  isRegistered : boolean;
  col?: number;
  xsCol?: number;
}
