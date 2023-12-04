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
  rank : number;
  isRegistered : boolean
}

export interface UserVoteBalanceModalProps {
  openModal: boolean;
  handleClose: () => void;
  modalSelected: string;
  handleModalSelect: (key: string) => void;
  showBalance: boolean;
  handleBalance: () => void;
  participantData ?: ParticipantInfoResponse
}
