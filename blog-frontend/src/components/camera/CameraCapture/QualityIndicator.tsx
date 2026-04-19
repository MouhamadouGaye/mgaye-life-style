// frontend/src/components/CameraCapture/QualityIndicator.tsx
import React from "react";
import "./QualityIndicator.css";

interface FaceAnalysis {
  isAligned: boolean;
  isCentered: boolean;
  isCorrectDistance: boolean;
  brightnessOk: boolean;
  symmetryScore: number;
  brightness: number;
}

interface QualityIndicatorProps {
  analysis: FaceAnalysis | null;
}

export const QualityIndicator: React.FC<QualityIndicatorProps> = ({
  analysis,
}) => {
  if (!analysis) {
    return (
      <div className="quality-indicator">
        <div className="quality-item searching">
          <span className="icon">🔍</span>
          <span>Recherche du visage...</span>
        </div>
      </div>
    );
  }

  const indicators = [
    { label: "Centrage", ok: analysis.isCentered, icon: "⊕" },
    { label: "Alignement", ok: analysis.isAligned, icon: "↔" },
    { label: "Distance", ok: analysis.isCorrectDistance, icon: "↕" },
    { label: "Éclairage", ok: analysis.brightnessOk, icon: "☀" },
    { label: "Symétrie", ok: analysis.symmetryScore > 0.85, icon: "◐" },
  ];

  const overallScore = indicators.filter((i) => i.ok).length;
  const percentage = Math.round((overallScore / indicators.length) * 100);

  return (
    <div className="quality-indicator">
      <div className="overall-score">
        <div
          className="score-circle"
          style={
            {
              "--score": percentage,
              "--color":
                percentage === 100
                  ? "#22c55e"
                  : percentage >= 60
                    ? "#f59e0b"
                    : "#ef4444",
            } as React.CSSProperties
          }
        >
          <span>{percentage}%</span>
        </div>
        <span className="score-label">Qualité</span>
      </div>

      <div className="indicators-list">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className={`indicator-item ${indicator.ok ? "ok" : "pending"}`}
          >
            <span className="indicator-icon">{indicator.icon}</span>
            <span className="indicator-label">{indicator.label}</span>
            <span
              className={`indicator-status ${indicator.ok ? "check" : "cross"}`}
            >
              {indicator.ok ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

      {analysis.brightness < 0.2 && (
        <div className="brightness-warning">
          <span className="warning-icon">💡</span>
          <span>
            Conseil : Orientez-vous vers une source de lumière naturelle
          </span>
        </div>
      )}
    </div>
  );
};
