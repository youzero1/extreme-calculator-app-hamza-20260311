export interface HistoryRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export interface CalculatorState {
  display: string;
  expression: string;
  result: string;
  memory: number;
  angleMode: 'deg' | 'rad';
  isScientific: boolean;
  history: HistoryRecord[];
  error: string | null;
}

export type ButtonType =
  | 'number'
  | 'operator'
  | 'function'
  | 'constant'
  | 'memory'
  | 'action'
  | 'equals';

export interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
  wide?: boolean;
  className?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
