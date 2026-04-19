import React, { useEffect, useRef } from 'react';
import './CaptureButton.css';

interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isReady?: boolean;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({
  onClick,
  disabled = false,
  isReady = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcut: Space or Enter triggers capture
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !disabled) {
        e.preventDefault();
        onClick();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [disabled, onClick]);

  return (
    <button
      ref={buttonRef}
      className={`capture-button ${isReady ? 'capture-button--ready' : ''} ${disabled ? 'capture-button--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Capturer la photo"
      aria-disabled={disabled}
      title={disabled ? 'Positionnez votre visage pour activer la capture' : 'Capturer (Espace)'}
      type="button"
    >
      {/* Outer ring */}
      <span className="capture-button__ring" aria-hidden="true" />

      {/* Inner circle / shutter */}
      <span className="capture-button__inner" aria-hidden="true">
        {isReady && (
          <span className="capture-button__pulse" aria-hidden="true" />
        )}
        {/* Camera icon */}
        <svg
          className="capture-button__icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="13"
            r="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </span>

      {/* Label */}
      <span className="capture-button__label">
        {disabled ? 'En attente...' : isReady ? 'Capturer' : 'Prêt'}
      </span>
    </button>
  );
};
