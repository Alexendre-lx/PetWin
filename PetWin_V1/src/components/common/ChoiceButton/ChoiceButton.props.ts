import { ReactNode } from 'react';

export interface ChoiceButtonProps {
  active: boolean;
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
