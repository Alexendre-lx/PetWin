import React, { ReactNode } from 'react';

export type MenuItemProps = {
  className: string;
  icon: string;
  value: string;
  useMouseDown: boolean;
  onClick: React.MouseEventHandler;
  rest?: ReactNode;
};
