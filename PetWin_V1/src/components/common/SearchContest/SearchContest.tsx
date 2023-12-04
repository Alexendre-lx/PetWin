import SearchIcon from '@petwin/icons/searchIcon';
import styles from './searchContest.module.scss';
import cn from 'classnames';
import Link from 'next/link';

function SearchContest() {
  return (
    <Link
      href={'/contestants/search'}
      className={cn(styles.SearchIcon, 'p-2 p-md-3 bg-white rounded-circle')}
    >
      <SearchIcon />
    </Link>
  );
}

export default SearchContest;
