// @ts-nocheck
import styles from './dropdownInput.module.scss';
import { useEffect, useRef, useState } from 'react';
import Menu from '../Menu/menu';
import classNames from 'classnames';
import { DropdownInputProps } from '@petwin/components/common/DropdownInput/DropdownInput.props';

const DropdownInput = ({
  className,
  options,
  value,
  onChange,
  disabled,
  input,
  fullWidth,
  disabledStatus,
  hasError,
  placeholder,
}: DropdownInputProps) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = (key: string | number) => () => {
    onChange(key);
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const selected = options.find(({ key }) => key === value);
  const mappedOptions = options.map((o) => ({
    ...o,
    onClick: handleClick(o.key),
  }));

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const nothingSelected = placeholder ? placeholder : 'Nothing selected...';

  return (
    <div
      ref={ref}
      className={classNames(
        styles.Container,
        disabled && styles.Disabled,
        input && styles.Input,
        fullWidth && styles.FullWidth,
        hasError && styles.HasError
      )}
    >
      <div
        className={classNames(
          styles.Selected,
          isOpen && styles.Open,
          input && styles.InputStyle,
          className
        )}
        onClick={toggle}
      >
        <div>{selected ? selected.value : nothingSelected}</div>
      </div>
      {isOpen ? (
        <Menu
          className={classNames(styles.DropDown)}
          ref={ref}
          selectedValue={selected && selected.value}
          disabledStatus={disabledStatus}
          options={mappedOptions}
        />
      ) : null}
    </div>
  );
};

export default DropdownInput;
