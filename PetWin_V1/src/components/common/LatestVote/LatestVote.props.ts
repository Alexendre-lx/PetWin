export interface LatestVoteCardProps {
  orange?: boolean;
  timestamp: string;
  name: string;
  voted_for: string;
  avatar: string;
  id: string;
}

export interface LatestVoteProps {
  orange?: boolean;
  voteFor?: string;
  votesData :{
    id: string;
    participantName: string;
    postedAt: string;
    voterName: string;
    votes: number;
    profilePicture : string;
  }[]

}
