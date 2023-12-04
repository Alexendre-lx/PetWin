import { StaticImageData } from 'next/image';

export interface ContestGridProps {
  contestGridData: {
    imageSource: StaticImageData | string;
    name: string;
    place : number;
    totalVotes: number | string;
    prize: number;
    prizeVotes: number | string;
    id?: string;
    col?: number;
    xsCol?: number;

  };
}
