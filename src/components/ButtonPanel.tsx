'use client';
import CalculatorButton from './CalculatorButton';
import { CalcButton } from '@/types';
import styles from './ButtonPanel.module.css';

interface ButtonPanelProps {
  angleMode: 'deg' | 'rad';
  onInput: (value: string) => void;
  onToggleAngle: () => void;
  isScientific: boolean;
  onToggleScientific: () => void;
}

export default function ButtonPanel({
  angleMode,
  onInput,
  onToggleAngle,
  isScientific,
  onToggleScientific,
}: ButtonPanelProps) {
  const scientificButtons: CalcButton[] = [
    { label: angleMode === 'deg' ? 'DEG' : 'RAD', value: 'ANGLE', type: 'action' },
    { label: 'sin', value: 'sin(', type: 'function' },
    { label: 'cos', value: 'cos(', type: 'function' },
    { label: 'tan', value: 'tan(', type: 'function' },
    { label: 'asin', value: 'asin(', type: 'function' },
    { label: 'acos', value: 'acos(', type: 'function' },
    { label: 'atan', value: 'atan(', type: 'function' },
    { label: 'log', value: 'log(', type: 'function' },
    { label: 'ln', value: 'ln(', type: 'function' },
    { label: 'logₙ', value: 'logBase(', type: 'function' },
    { label: '√x', value: 'sqrt(', type: 'function' },
    { label: '∛x', value: 'cbrt(', type: 'function' },
    { label: 'ⁿ√x', value: 'nthRoot(', type: 'function' },
    { label: 'x!', value: 'x!', type: 'function' },
    { label: '|x|', value: 'abs(', type: 'function' },
    { label: '⌊x⌋', value: 'floor(', type: 'function' },
    { label: '⌈x⌉', value: 'ceil(', type: 'function' },
    { label: 'xʸ', value: 'x^y', type: 'function' },
    { label: '10ˣ', value: '10^x', type: 'function' },
    { label: 'eˣ', value: 'e^x', type: 'function' },
    { label: 'π', value: 'π', type: 'constant' },
    { label: 'e', value: 'e', type: 'constant' },
    { label: 'φ', value: 'φ', type: 'constant' },
  ];

  const mainButtons: CalcButton[] = [
    { label: 'MC', value: 'MC', type: 'memory' },
    { label: 'MR', value: 'MR', type: 'memory' },
    { label: 'M+', value: 'M+', type: 'memory' },
    { label: 'M−', value: 'M-', type: 'memory' },
    { label: 'C', value: 'C', type: 'action' },
    { label: '⌫', value: 'Backspace', type: 'action' },
    { label: '%', value: '%', type: 'operator' },
    { label: '÷', value: '/', type: 'operator' },
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '*', type: 'operator' },
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '−', value: '-', type: 'operator' },
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
    { label: '(', value: '(', type: 'operator' },
    { label: ')', value: ')', type: 'operator' },
    { label: '.', value: '.', type: 'number' },
    { label: 'mod', value: 'mod', type: 'operator' },
    { label: '0', value: '0', type: 'number', wide: true },
    { label: '=', value: '=', type: 'equals', wide: false },
  ];

  const handleClick = (value: string) => {
    if (value === 'ANGLE') {
      onToggleAngle();
      return;
    }
    onInput(value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <button
          className={`${styles.toggleSci} ${isScientific ? styles.active : ''}`}
          onClick={onToggleScientific}
        >
          {isScientific ? '▲ Scientific' : '▼ Scientific'}
        </button>
      </div>

      {isScientific && (
        <div className={styles.scientificGrid}>
          {scientificButtons.map((btn) => (
            <CalculatorButton
              key={btn.value}
              {...btn}
              onClick={handleClick}
            />
          ))}
        </div>
      )}

      <div className={styles.mainGrid}>
        {mainButtons.map((btn, i) => (
          <CalculatorButton
            key={`${btn.value}-${i}`}
            {...btn}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
