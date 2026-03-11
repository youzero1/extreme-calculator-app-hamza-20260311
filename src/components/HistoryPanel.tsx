'use client';
import { useState } from 'react';
import { HistoryRecord } from '@/types';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
  history: HistoryRecord[];
  onSelect: (record: HistoryRecord) => void;
  onDelete: (id?: number) => void;
  onSearch: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onSearch,
  isOpen,
  onClose,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    onSearch(q);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>History</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close history">
            ✕
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search calculations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.clearAll} onClick={() => onDelete()} title="Clear all history">
            🗑 Clear All
          </button>
        </div>

        <div className={styles.list}>
          {history.length === 0 ? (
            <div className={styles.empty}>No history yet</div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                className={styles.record}
                onClick={() => {
                  onSelect(record);
                  onClose();
                }}
              >
                <div className={styles.recordLeft}>
                  <div className={styles.expr}>{record.expression}</div>
                  <div className={styles.res}>= {record.result}</div>
                  <div className={styles.time}>{formatDate(String(record.createdAt))}</div>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                  title="Delete"
                  aria-label="Delete record"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
