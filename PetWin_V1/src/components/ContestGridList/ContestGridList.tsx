import ContestGridImages from '../common/ContestGridImages/ContestGridImages';
import { ContestGridListProps } from './ContestGridProps.props';
import styles from './contestGridList.module.scss';
import cn from 'classnames';

function ContestGridList({
  contestData,
}: {
  contestData: ContestGridListProps[];
}) {
  return (
    <> 
      <div className={cn(styles.ContestGridListContainer, 'row')}>
        {contestData.map((contest: ContestGridListProps) => (
          <ContestGridImages
            key={contest.id}
            contestGridData={{ ...contest, col: 3, xsCol: 6 }}
          />
        ))}
      </div>
    </>
  );
}

export default ContestGridList;
