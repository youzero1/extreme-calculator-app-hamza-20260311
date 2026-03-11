'use client';
import styles from './Display.module.css';

interface DisplayProps {
  expression: string;
  display: string;
  error: string | null;
  copied: boolean;
  onCopy: () => void;
}

export default function Display({ expression, display, error, copied, onCopy }: DisplayProps) {
  const isError = error !== null || display === 'Error';

  const fontSize =
    display.length > 20 ? '1rem' : display.length > 14 ? '1.4rem' : display.length > 10 ? '1.8rem' : '2.2rem';

  return (
    <div className={styles.display}>
      <div className={styles.expression}>
        {expression || '\u00a0'}
      </div>
      <div className={`${styles.result} ${isError ? styles.error : ''}`} style={{ fontSize }}>
        {isError ? (error || 'Error') : display}
      </div>
      <button
        className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
        onClick={onCopy}
        title="Copy result"
        aria-label="Copy result to clipboard"
      >
        {copied ? '✓ Copied' : '⎘ Copy'}
      </button>
    </div>
  );
}
