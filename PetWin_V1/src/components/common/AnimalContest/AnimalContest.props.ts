import { ContestGridListProps } from '@petwin/components/ContestGridList/ContestGridProps.props';

interface ContestInfo {
  name: string;
  date2: {
    formattedDate: string;
    daysLeft: string;
  }
  participants: number;
  amountToWin: number;
  prize : string[];
  prizeVotes : string[];
}
export interface AnimalContestProps {
  contestData: ContestInfo;

}


