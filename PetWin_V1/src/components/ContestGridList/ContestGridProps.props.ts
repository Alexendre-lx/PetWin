import { StaticImageData } from 'next/image';

export interface ContestGridListProps {
  name: string;
  imageSource: StaticImageData | string;
  prize: number;
  place: number;
  totalVotes: number | string;
  prizeVotes: number | string;
  id ?: string;
  col?: number;
  xsCol?: number;
}
