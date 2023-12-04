import styles from './container.module.scss';
import { ContainerProps } from '@petwin/components/common/Container/Container.props';
import cn from 'classnames';

const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div className={cn(styles.Container, className && className)} {...rest}>
      {children}
    </div>
  );
};

export default Container;
