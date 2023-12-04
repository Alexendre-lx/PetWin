
import { StaticImageData } from 'next/image';
export interface ParticipantProps {
    participant: {
      name: string;
      id: string;
      place: number;
      placeRegion : number;
      votes: number;
      pictureURL : string | StaticImageData;
      isRegistered ?: boolean;
    }
  }
  