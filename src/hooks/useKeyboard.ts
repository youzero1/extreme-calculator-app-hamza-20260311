import { useEffect } from 'react';

interface KeyboardConfig {
  onKey: (key: string) => void;
}

export function useKeyboard({ onKey }: KeyboardConfig) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const key = e.key;

      if (key >= '0' && key <= '9') {
        onKey(key);
      } else if (key === '+') {
        onKey('+');
      } else if (key === '-') {
        onKey('-');
      } else if (key === '*') {
        onKey('*');
      } else if (key === '/') {
        e.preventDefault();
        onKey('/');
      } else if (key === '%') {
        onKey('%');
      } else if (key === '^') {
        onKey('^');
      } else if (key === '(') {
        onKey('(');
      } else if (key === ')') {
        onKey(')');
      } else if (key === '.') {
        onKey('.');
      } else if (key === 'Enter' || key === '=') {
        onKey('=');
      } else if (key === 'Backspace') {
        onKey('Backspace');
      } else if (key === 'Escape') {
        onKey('C');
      } else if (key === 'Delete') {
        onKey('C');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey]);
}
