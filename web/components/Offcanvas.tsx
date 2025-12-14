import React from 'react';
import styles from './Offcanvas.module.css';

interface OffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'start' | 'end'; // start = left, end = right
}

export const Offcanvas: React.FC<OffcanvasProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'end',
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className={styles.backdrop} onClick={onClose} />
      )}

      {/* Offcanvas */}
      <div
        className={`${styles.offcanvas} ${styles[position]} ${isOpen ? styles.show : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offcanvas-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="offcanvas-title" className={styles.title}>
            {title}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </>
  );
};
