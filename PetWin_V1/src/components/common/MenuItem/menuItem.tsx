import classNames from 'classnames';
import styles from './menuItem.module.scss';
import { MenuItemProps } from './menuItem.props';

const MenuItem = ({
  className,
  icon,
  value,
  useMouseDown,
  onClick,
  ...rest
}: MenuItemProps) => {
  const clickHandleProps = onClick
    ? {
        [useMouseDown ? 'onMouseDown' : 'onCLick']: onClick,
      }
    : undefined;

  return (
    <button
      className={classNames(styles.Container, className)}
      type="button"
      title={value}
      {...clickHandleProps}
      {...rest}
    >
      {icon ? icon : null}
      <span>{value}</span>
    </button>
  );
};

export default MenuItem;
