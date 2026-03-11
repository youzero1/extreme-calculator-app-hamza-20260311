'use client';
import styles from './MemoryIndicator.module.css';

interface MemoryIndicatorProps {
  memory: number;
}

export default function MemoryIndicator({ memory }: MemoryIndicatorProps) {
  if (memory === 0) return null;

  return (
    <div className={styles.indicator}>
      <span className={styles.label}>M</span>
      <span className={styles.value}>{memory}</span>
    </div>
  );
}
