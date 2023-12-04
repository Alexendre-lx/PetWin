interface Photo {
    id: number;
    imageSource: string;
  }

export interface ContestantEditPictureProps {
    openModal: boolean;
    handleClose: () => void;
    participantId : string;
    ownerId : string;
    participantSpecie : string;
    participantPictures : Photo[];
    participantMainPicture : string;
  }
  