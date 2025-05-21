
export interface ComboBoxItem {
  value: string;
  label: string;
  icon?: string;
}

export interface ComboBoxProps {
  items: ComboBoxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}
