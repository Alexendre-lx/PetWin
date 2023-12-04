import { StaticImageData } from 'next/image';

export interface PrizesProps {
  prizesData: {
    imageSource: string | StaticImageData,
    key: string, 
    value: string,
    goldenVotes: number,
    silverVotes: number,
    bronzeVotes: number,
  }[];
  handlePrizeOnClick: (country: string) => void;
  prizeWorld : string[];
  prizeVotesWorld : string[];
}
