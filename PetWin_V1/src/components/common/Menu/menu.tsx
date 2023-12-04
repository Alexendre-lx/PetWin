// @ts-nocheck
import { forwardRef } from 'react';
import MenuItem from '../MenuItem/menuItem';
import classNames from 'classnames';
import styles from './menu.module.scss';
import { MenuProps } from './menu.props';

const Menu = (
  {
    className,
    options,
    useMouseDown,
    disabled,
    selectedValue,
    disabledStatus = false,
  }: MenuProps,
  ref: any
) => {
  return (
    <div className={classNames(styles.Container, className)} ref={ref}>
      {options.map((o, idx) => (
        <MenuItem
          {...o}
          key={idx}
          useMouseDown
          disabled={disabledStatus && selectedValue && selectedValue >= o.value}
        />
      ))}
    </div>
  );
};

export default forwardRef(Menu);
