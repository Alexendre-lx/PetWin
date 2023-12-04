export interface NewParticipantProps {
 loadMoreData?: () => void;
 hasMore ?: boolean;
  participantsList: {
    description: string;
    name: string;
    id: string;
    place: number;
    votes: number;
    pictureURL : string;
    isRegistered : boolean;
  }[];
}
