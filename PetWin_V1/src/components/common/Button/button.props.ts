import React, { ReactElement } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  source?: string;
  icon?: ReactElement;
  orange?: boolean;
  white?: boolean;
  md?: boolean;
  fullWidth?: boolean;
  big?: boolean;
  className?: string;
}
