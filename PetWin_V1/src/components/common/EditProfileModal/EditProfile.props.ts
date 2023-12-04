export interface EditProfileProps {
  openModal: boolean;
  handleClose: () => void;
  userID : string;
  userName: string;
  userLocation : string;
}