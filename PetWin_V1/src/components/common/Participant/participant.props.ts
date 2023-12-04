export interface ParticipantProps {
  participant: {
    name: string;
    description : string;
    id: string;
    place: number;
    votes: number;
    pictureURL : string;
    isRegistered : boolean;
  };
}
