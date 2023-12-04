import { StaticImageData } from 'next/image';

export interface ContestantSliderItemProps {
    userPicture: string | StaticImageData;
    participantPicture: string ;
    name: string;
    byName: string;
    vote: number;
    participantId : string;

}
