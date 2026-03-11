import { useState, useCallback, useEffect } from 'react';
import { evaluateExpression } from '@/lib/evaluator';
import { HistoryRecord } from '@/types';

export function useCalculator() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchHistory = useCallback(async (search = '') => {
    try {
      const url = search ? `/api/history?search=${encodeURIComponent(search)}` : '/api/history';
      const res = await fetch(url);
      const json = await res.json();
      if (json.data) setHistory(json.data);
    } catch {
      console.error('Failed to fetch history');
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveToHistory = useCallback(async (expr: string, res: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result: res }),
      });
      await fetchHistory();
    } catch {
      console.error('Failed to save history');
    }
  }, [fetchHistory]);

  const deleteHistory = useCallback(async (id?: number) => {
    try {
      const url = id ? `/api/history?id=${id}` : '/api/history';
      await fetch(url, { method: 'DELETE' });
      await fetchHistory();
    } catch {
      console.error('Failed to delete history');
    }
  }, [fetchHistory]);

  const appendToExpression = useCallback((value: string) => {
    setError(null);
    setJustEvaluated(false);
    setExpression((prev) => {
      if (justEvaluated && /[\d.]/.test(value)) {
        return value;
      }
      return prev + value;
    });
    setDisplay((prev) => {
      if (justEvaluated && /[\d.]/.test(value)) {
        return value;
      }
      if (prev === '0' && /^[\d]$/.test(value)) {
        return value;
      }
      return prev + value;
    });
  }, [justEvaluated]);

  const handleInput = useCallback((value: string) => {
    setError(null);

    if (value === 'C') {
      setExpression('');
      setDisplay('0');
      setResult('');
      setJustEvaluated(false);
      return;
    }

    if (value === 'CE') {
      setDisplay('0');
      setExpression('');
      setJustEvaluated(false);
      return;
    }

    if (value === 'Backspace') {
      setExpression((prev) => {
        const newExpr = prev.slice(0, -1);
        setDisplay(newExpr || '0');
        return newExpr;
      });
      setJustEvaluated(false);
      return;
    }

    if (value === '=') {
      if (!expression && display === '0') return;
      const exprToEval = expression || display;
      try {
        const res = evaluateExpression(exprToEval, angleMode);
        setResult(res);
        setDisplay(res);
        saveToHistory(exprToEval, res);
        setExpression(res);
        setJustEvaluated(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error';
        setError(msg);
        setDisplay('Error');
        setResult('');
        setJustEvaluated(false);
      }
      return;
    }

    // Memory functions
    if (value === 'MC') {
      setMemory(0);
      return;
    }
    if (value === 'MR') {
      const memStr = String(memory);
      setExpression((prev) => {
        const newExpr = justEvaluated ? memStr : prev + memStr;
        setDisplay(newExpr || '0');
        return newExpr;
      });
      setJustEvaluated(false);
      return;
    }
    if (value === 'M+') {
      const current = parseFloat(result || display);
      if (!isNaN(current)) setMemory((m) => m + current);
      return;
    }
    if (value === 'M-') {
      const current = parseFloat(result || display);
      if (!isNaN(current)) setMemory((m) => m - current);
      return;
    }

    // Operators after evaluation
    if (justEvaluated && /^[+\-*/%^]$/.test(value)) {
      setExpression((prev) => prev + value);
      setDisplay((prev) => prev + value);
      setJustEvaluated(false);
      return;
    }

    // Functions that append with open paren
    const funcs = ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'log(', 'ln(', 'sqrt(', 'cbrt(', 'abs(', 'floor(', 'ceil(', 'nthRoot(', 'logBase('];
    if (funcs.includes(value)) {
      setJustEvaluated(false);
      setExpression((prev) => justEvaluated ? value : prev + value);
      setDisplay((prev) => justEvaluated ? value : prev + value);
      return;
    }

    // Constants
    if (value === 'π') {
      const val = String(Math.PI);
      setExpression((prev) => justEvaluated ? val : prev + val);
      setDisplay((prev) => justEvaluated ? val : prev + val);
      setJustEvaluated(false);
      return;
    }
    if (value === 'e') {
      const val = String(Math.E);
      setExpression((prev) => justEvaluated ? val : prev + val);
      setDisplay((prev) => justEvaluated ? val : prev + val);
      setJustEvaluated(false);
      return;
    }
    if (value === 'φ') {
      const val = String((1 + Math.sqrt(5)) / 2);
      setExpression((prev) => justEvaluated ? val : prev + val);
      setDisplay((prev) => justEvaluated ? val : prev + val);
      setJustEvaluated(false);
      return;
    }

    // x! factorial
    if (value === 'x!') {
      setExpression((prev) => prev + '!');
      setDisplay((prev) => prev + '!');
      setJustEvaluated(false);
      return;
    }

    // x^y
    if (value === 'x^y') {
      setExpression((prev) => prev + '^');
      setDisplay((prev) => prev + '^');
      setJustEvaluated(false);
      return;
    }

    // 10^x
    if (value === '10^x') {
      setExpression((prev) => (justEvaluated ? '10^' : prev + '10^'));
      setDisplay((prev) => (justEvaluated ? '10^' : prev + '10^'));
      setJustEvaluated(false);
      return;
    }

    // e^x
    if (value === 'e^x') {
      const eVal = String(Math.E);
      setExpression((prev) => (justEvaluated ? eVal + '^' : prev + eVal + '^'));
      setDisplay((prev) => (justEvaluated ? eVal + '^' : prev + eVal + '^'));
      setJustEvaluated(false);
      return;
    }

    // Number/operator input
    if (justEvaluated && /^[\d.]$/.test(value)) {
      setExpression(value);
      setDisplay(value);
      setJustEvaluated(false);
      return;
    }

    setJustEvaluated(false);
    setExpression((prev) => {
      const newExpr = prev === '0' && /^[\d]$/.test(value) ? value : prev + value;
      setDisplay(newExpr);
      return newExpr;
    });
  }, [expression, display, result, memory, angleMode, justEvaluated, saveToHistory]);

  const handleHistoryClick = useCallback((record: HistoryRecord) => {
    setExpression(record.result);
    setDisplay(record.result);
    setResult(record.result);
    setJustEvaluated(true);
    setError(null);
  }, []);

  const copyToClipboard = useCallback(async () => {
    const value = result || display;
    if (value && value !== '0' && value !== 'Error') {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        console.error('Failed to copy');
      }
    }
  }, [result, display]);

  const toggleAngleMode = useCallback(() => {
    setAngleMode((m) => (m === 'deg' ? 'rad' : 'deg'));
  }, []);

  return {
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
  };
}
