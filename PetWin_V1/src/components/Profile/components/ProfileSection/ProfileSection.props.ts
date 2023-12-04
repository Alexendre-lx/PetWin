import { StaticImageData } from 'next/image';
interface VoteData {
  id: string;
  participantName: string;
  postedAt: string;
  voterName: string;
  votes: number;
  profilePicture: string;
}
export interface ProfileSectionProps {
  animalCardsList: {
    name: string;
    id: string;
    place: number;
    placeRegion : number;
    votes: number;
    pictureURL : string | StaticImageData ;
    isRegistered : boolean;
  }[];
  participantsVotesByOwner: VoteData[];
}
