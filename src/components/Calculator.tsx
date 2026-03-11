'use client';
import { useState } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useTheme } from '@/hooks/useTheme';
import Display from './Display';
import ButtonPanel from './ButtonPanel';
import HistoryPanel from './HistoryPanel';
import ThemeToggle from './ThemeToggle';
import MemoryIndicator from './MemoryIndicator';
import styles from './Calculator.module.css';

export default function Calculator() {
  const {
    expression,
    display,
    result,
    memory,
    angleMode,
    history,
    error,
    copied,
    handleInput,
    handleHistoryClick,
    copyToClipboard,
    toggleAngleMode,
    deleteHistory,
    fetchHistory,
  } = useCalculator();

  const { theme, toggleTheme } = useTheme();
  const [isScientific, setIsScientific] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  useKeyboard({ onKey: handleInput });

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>⚡ Extreme Calc</h1>
            <MemoryIndicator memory={memory} />
          </div>
          <div className={styles.headerRight}>
            <button
              className={styles.historyBtn}
              onClick={() => setHistoryOpen(true)}
              title="View history"
              aria-label="Open calculation history"
            >
              🕐 History
              {history.length > 0 && (
                <span className={styles.historyCount}>{history.length}</span>
              )}
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        <Display
          expression={expression}
          display={display}
          error={error}
          copied={copied}
          onCopy={copyToClipboard}
        />

        <ButtonPanel
          angleMode={angleMode}
          onInput={handleInput}
          onToggleAngle={toggleAngleMode}
          isScientific={isScientific}
          onToggleScientific={() => setIsScientific((s) => !s)}
        />
      </div>

      <HistoryPanel
        history={history}
        onSelect={handleHistoryClick}
        onDelete={deleteHistory}
        onSearch={fetchHistory}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
