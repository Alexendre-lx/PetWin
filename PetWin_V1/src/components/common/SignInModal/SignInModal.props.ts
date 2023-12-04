interface ParticipantData {
  ownerId: string,
  location: string,
  breed: string,
  name: string,
  description: string,
  specie: string,
  pictures: string[],

}


export interface SignInModalProps {
  openModal: boolean;
  handleClose: () => void;
  isSignUpForm?: boolean;
  emailModal?: boolean;
  participantData?: ParticipantData;
}
