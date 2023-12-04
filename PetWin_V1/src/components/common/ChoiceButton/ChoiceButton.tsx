import styles from './choiceButtons.module.scss';
import { ChoiceButtonProps } from '@petwin/components/common/ChoiceButton/ChoiceButton.props';
import cn from 'classnames';

function ChoiceButton({ active, children, onClick }: ChoiceButtonProps) {
  return (
    <button
      className={cn(active && styles.Active, styles.Button, 'px-md-5 px-2')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ChoiceButton;
