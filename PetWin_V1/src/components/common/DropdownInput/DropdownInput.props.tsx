export type DropdownInputProps = {
  className?: any;
  options: { key: string; value: string }[] | undefined;
  value: string;
  onChange: (key: string) => void;
  disabled?: boolean;
  input?: boolean;
  fullWidth?: boolean;
  disabledStatus?: boolean;
  hasError?: boolean;
  placeholder?: string;
};
