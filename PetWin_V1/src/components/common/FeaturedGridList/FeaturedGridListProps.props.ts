import { StaticImageData } from 'next/image';

export interface FeaturedGridListProps {
  name: string;
  imageSource: StaticImageData | string;
  prize: number;
  place: number | string;
  totalVotes: number | string;
  prizeVotes: number | string;
  id: string;
  isRegistered : boolean;
}
