import { UserCredential } from "firebase/auth";
export interface ParticipantData {
  ownerId: string,
  location: string,
  breed: string,
  name: string,
  description: string,
  specie: string,
  pictures: string[],

}

export interface CreateProfileModalProps {
  openModal: boolean;
  handleCancel: () => void;
  email ?: string;
  password?: string;
  participantId ?: string;
  participantData ?: ParticipantData;
  userCredential ?: UserCredential;
  isGoogle?: boolean;
}
