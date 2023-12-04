import React from 'react';

export type MenuProps = {
  className: string;
  options: [{ key: string; value: string; onClick: React.MouseEventHandler }];
  useMouseDown: boolean;
  disabled: boolean;
  selectedValue: string;
  disabledStatus: boolean;
};
