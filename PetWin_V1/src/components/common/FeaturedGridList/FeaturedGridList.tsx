import FeaturedGridItem from '../FeaturedGridItem/FeaturedGridItem';
import { FeaturedGridListProps } from './FeaturedGridListProps.props';
import cn from 'classnames';
import styles from './featuredGridList.module.scss';
import { useEffect, useState } from 'react';

function FeaturedGridList({
  featuredGridData,
}: {
  featuredGridData: FeaturedGridListProps[];
}) {
  const [featuredData, setFeaturedData] = useState<FeaturedGridListProps[]>([]);

  useEffect(() => {
    setFeaturedData(featuredGridData);
  }, [featuredGridData]);

  return (
    <>
      <div className={cn('row d-none d-xl-flex', styles.FeaturedGridContainer)}>
        {featuredData.map((featuredItem) => (
          <FeaturedGridItem
            key={featuredItem.id}
            featuredGridItem={{ ...featuredItem, col: 3, xsCol: 6 }}
          />
        ))}
      </div>
    </>
  );
}

export default FeaturedGridList;
