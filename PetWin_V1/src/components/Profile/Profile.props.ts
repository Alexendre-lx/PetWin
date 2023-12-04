import { Timestamp } from 'firebase/firestore';

export interface UserInfoData {
    userID : string;
    email : string;
    name: string;
    location: string;
    profilePicture: string;
    votesAvailable : number;
    registrationDate : Timestamp;
  }

