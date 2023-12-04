interface Photo {
  id: number;
  imageSource: string;
}

interface ParticipantInfoResponse {
  name: string;
  breed: string;
  location: string;
  mainPhoto: string;
  ownerPicture: string;
  awards: {
    name: string;
    place: string;
  }[];
  description: string;
  ownerName: string;
  photos: Photo[];
  ownerId: string;
  contestIdInProgress: string;
  specie: string;
  rank: number;
  isRegistered: boolean
}


export interface EditPetProfileProps {
  openModal: boolean;
  handleClose: () => void;
  participantId : string;
  participantName: string;
  participantBreed : string;
  participantDescription : string;
  ownerId : string;
  participantSpecie : string
}
