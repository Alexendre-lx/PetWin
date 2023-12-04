import { ButtonProps } from './button.props';
import styles from './button.module.scss';
import cn from 'classnames';

function Button({
  source,
  label,
  icon,
  white,
  orange,
  md,
  fullWidth,
  big,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.Button,
        'text-nowrap',
        orange && styles.OrangeButton,
        white && styles.WhiteButton,
        md && styles.Md,
        fullWidth && styles.FullWidth,
        big && styles.Big,
        className && className
      )}
      {...rest}
    >
      {source ? <a href={`http://localhost:3000/${source}`}>{label}</a> : <span>{label}</span>}
      {icon && icon}
    </button>
  );
}

export default Button;
