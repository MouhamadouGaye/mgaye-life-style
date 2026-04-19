import React, { useState, useEffect } from 'react';
import './PhotoReview.css';

interface PhotoMetadata {
  brightness: number;
  symmetryScore: number;
  faceSize: number;
  timestamp: string;
}

interface PhotoReviewProps {
  imageData: string;
  metadata: PhotoMetadata | null;
  onRetake: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const MetricBar: React.FC<{ label: string; value: number; unit?: string; min?: number; max?: number }> = ({
  label,
  value,
  unit = '%',
  min = 0,
  max = 1,
}) => {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  const isGood = pct >= 60;
  const isWarn = pct >= 35 && pct < 60;

  return (
    <div className="pr-metric">
      <div className="pr-metric__header">
        <span className="pr-metric__label">{label}</span>
        <span className={`pr-metric__value ${isGood ? 'good' : isWarn ? 'warn' : 'bad'}`}>
          {Math.round(value * 100)}{unit}
        </span>
      </div>
      <div className="pr-metric__track">
        <div
          className={`pr-metric__fill ${isGood ? 'good' : isWarn ? 'warn' : 'bad'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const PhotoReview: React.FC<PhotoReviewProps> = ({
  imageData,
  metadata,
  onRetake,
  onConfirm,
  isLoading = false,
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const formattedDate = metadata?.timestamp
    ? new Date(metadata.timestamp).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const overallScore = metadata
    ? (metadata.brightness + metadata.symmetryScore + metadata.faceSize) / 3
    : 0;

  const scoreLabel =
    overallScore > 0.7 ? 'Excellente' : overallScore > 0.45 ? 'Acceptable' : 'Médiocre';
  const scoreClass =
    overallScore > 0.7 ? 'good' : overallScore > 0.45 ? 'warn' : 'bad';

  return (
    <div className={`photo-review ${revealed ? 'photo-review--revealed' : ''}`}>
      {/* Header */}
      <div className="photo-review__header">
        <span className="photo-review__tag">RÉVISION</span>
        <h2 className="photo-review__title">Vérifiez votre photo</h2>
        <p className="photo-review__subtitle">Confirmez ou recommencez la capture</p>
      </div>

      <div className="photo-review__body">
        {/* Image panel */}
        <div className="photo-review__image-panel">
          <div className="photo-review__frame">
            <div className="photo-review__corner tl" />
            <div className="photo-review__corner tr" />
            <div className="photo-review__corner bl" />
            <div className="photo-review__corner br" />
            <img
              src={imageData}
              alt="Photo capturée"
              className="photo-review__image"
              draggable={false}
            />
            <div className={`photo-review__badge ${scoreClass}`}>
              {scoreLabel}
            </div>
          </div>
          <p className="photo-review__timestamp">Pris le {formattedDate}</p>
        </div>

        {/* Metadata panel */}
        {metadata && (
          <div className="photo-review__meta-panel">
            <h3 className="photo-review__meta-title">Qualité de la photo</h3>

            <MetricBar label="Luminosité" value={metadata.brightness} />
            <MetricBar label="Symétrie du visage" value={metadata.symmetryScore} />
            <MetricBar label="Taille du visage" value={metadata.faceSize} />

            <div className="photo-review__checklist">
              <div className={`photo-review__check-item ${metadata.brightness >= 0.15 ? 'ok' : 'fail'}`}>
                <span className="check-icon">{metadata.brightness >= 0.15 ? '✓' : '✗'}</span>
                Éclairage suffisant
              </div>
              <div className={`photo-review__check-item ${metadata.symmetryScore >= 0.85 ? 'ok' : 'fail'}`}>
                <span className="check-icon">{metadata.symmetryScore >= 0.85 ? '✓' : '✗'}</span>
                Visage centré & symétrique
              </div>
              <div className={`photo-review__check-item ${metadata.faceSize >= 0.35 ? 'ok' : 'fail'}`}>
                <span className="check-icon">{metadata.faceSize >= 0.35 ? '✓' : '✗'}</span>
                Distance correcte
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="photo-review__actions">
        <button
          className="photo-review__btn photo-review__btn--retake"
          onClick={onRetake}
          disabled={isLoading}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.51 15a9 9 0 1 0 .49-4.95L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Recommencer
        </button>

        <button
          className="photo-review__btn photo-review__btn--confirm"
          onClick={onConfirm}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? (
            <>
              <span className="photo-review__spinner" />
              Envoi...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Confirmer
            </>
          )}
        </button>
      </div>
    </div>
  );
};
