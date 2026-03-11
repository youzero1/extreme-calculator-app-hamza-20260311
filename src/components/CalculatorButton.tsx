'use client';
import styles from './CalculatorButton.module.css';

interface CalculatorButtonProps {
  label: string;
  value: string;
  type: string;
  wide?: boolean;
  onClick: (value: string) => void;
}

export default function CalculatorButton({ label, value, type, wide, onClick }: CalculatorButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[type] || ''} ${wide ? styles.wide : ''}`}
      onClick={() => onClick(value)}
      title={value}
    >
      {label}
    </button>
  );
}
