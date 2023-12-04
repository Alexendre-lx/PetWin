import { StaticImageData } from 'next/image';

export interface RegionRankingProps {
  imageSource: StaticImageData;
  country: string;
  goldenVotes: number;
  silverVotes: number;
  bronzeVotes: number;
}
