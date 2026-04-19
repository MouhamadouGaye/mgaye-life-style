// import React from 'react';
// import './FaceGuide.css';

// export interface FacePosition {
//   centerX: number;
//   centerY: number;
//   faceWidth: number;
//   faceHeight: number;
//   rotation: number;
// }

// interface FaceGuideProps {
//   position?: FacePosition | null;
//   isAligned?: boolean;
//   isCentered?: boolean;
//   isCorrectDistance?: boolean;
// }

// export const FaceGuide: React.FC<FaceGuideProps> = ({
//   position,
//   isAligned = false,
//   isCentered = false,
//   isCorrectDistance = false,
// }) => {
//   const allGood = isAligned && isCentered && isCorrectDistance;
//   const someGood = [isAligned, isCentered, isCorrectDistance].filter(Boolean).length >= 2;

//   const guideColor = allGood
//     ? 'var(--guide-color-good)'
//     : someGood
//     ? 'var(--guide-color-warn)'
//     : 'var(--guide-color-bad)';

//   const statusLabel = allGood
//     ? 'Parfait'
//     : someGood
//     ? 'Ajustez...'
//     : 'Positionnez-vous';

//   return (
//     <div className="face-guide" aria-label="Guide de positionnement du visage">
//       <svg
//         className="face-guide__svg"
//         viewBox="0 0 100 100"
//         xmlns="http://www.w3.org/2000/svg"
//         aria-hidden="true"
//       >
//         {/* Oval face outline */}
//         <ellipse
//           className={`face-guide__oval ${allGood ? 'face-guide__oval--good' : ''}`}
//           cx="50"
//           cy="48"
//           rx="28"
//           ry="38"
//           fill="none"
//           stroke={guideColor}
//           strokeWidth="1.5"
//           strokeDasharray={allGood ? '0' : '4 2'}
//         />

//         {/* Eye line guide */}
//         <line
//           className="face-guide__eye-line"
//           x1="24"
//           y1="40"
//           x2="76"
//           y2="40"
//           stroke={guideColor}
//           strokeWidth="0.5"
//           strokeDasharray="2 2"
//           opacity="0.6"
//         />

//         {/* Center vertical line */}
//         <line
//           className="face-guide__center-line"
//           x1="50"
//           y1="12"
//           x2="50"
//           y2="88"
//           stroke={guideColor}
//           strokeWidth="0.5"
//           strokeDasharray="2 2"
//           opacity="0.6"
//         />

//         {/* Corner brackets */}
//         {/* Top-left */}
//         <polyline
//           points="8,18 8,8 18,8"
//           fill="none"
//           stroke={guideColor}
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />
//         {/* Top-right */}
//         <polyline
//           points="82,8 92,8 92,18"
//           fill="none"
//           stroke={guideColor}
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />
//         {/* Bottom-left */}
//         <polyline
//           points="8,82 8,92 18,92"
//           fill="none"
//           stroke={guideColor}
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />
//         {/* Bottom-right */}
//         <polyline
//           points="82,92 92,92 92,82"
//           fill="none"
//           stroke={guideColor}
//           strokeWidth="1.5"
//           strokeLinecap="round"
//         />

//         {/* Live face position indicator dot */}
//         {position && (
//           <circle
//             cx={position.centerX * 100}
//             cy={position.centerY * 100}
//             r="1.5"
//             fill={guideColor}
//             opacity="0.8"
//           />
//         )}

//         {/* Checkmark when all good */}
//         {allGood && (
//           <polyline
//             className="face-guide__check"
//             points="42,49 47,54 58,43"
//             fill="none"
//             stroke={guideColor}
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         )}
//       </svg>

//       <div
//         className="face-guide__status"
//         style={{ color: guideColor }}
//         role="status"
//         aria-live="polite"
//       >
//         <span
//           className={`face-guide__status-dot ${
//             allGood
//               ? 'face-guide__status-dot--good'
//               : someGood
//               ? 'face-guide__status-dot--warn'
//               : 'face-guide__status-dot--bad'
//           }`}
//         />
//         {statusLabel}
//       </div>

//       <div className="face-guide__indicators" aria-label="Indicateurs de position">
//         <span
//           className={`face-guide__indicator ${isAligned ? 'face-guide__indicator--ok' : ''}`}
//           title="Alignement"
//         >
//           ↔ Aligné
//         </span>
//         <span
//           className={`face-guide__indicator ${isCentered ? 'face-guide__indicator--ok' : ''}`}
//           title="Centré"
//         >
//           ⊕ Centré
//         </span>
//         <span
//           className={`face-guide__indicator ${isCorrectDistance ? 'face-guide__indicator--ok' : ''}`}
//           title="Distance"
//         >
//           ↕ Distance
//         </span>
//       </div>
//     </div>
//   );
// };
import React from "react";
import "./FaceGuide.css";

// Type-only — no runtime import, avoids Vite ESM error with @mediapipe packages
export type { Results } from "@mediapipe/face_mesh";

export interface FacePosition {
  centerX: number;
  centerY: number;
  faceWidth: number;
  faceHeight: number;
  rotation: number;
}

interface FaceGuideProps {
  position?: FacePosition | null;
  isAligned?: boolean;
  isCentered?: boolean;
  isCorrectDistance?: boolean;
}

export const FaceGuide: React.FC<FaceGuideProps> = ({
  position,
  isAligned = false,
  isCentered = false,
  isCorrectDistance = false,
}) => {
  const allGood = isAligned && isCentered && isCorrectDistance;
  const someGood =
    [isAligned, isCentered, isCorrectDistance].filter(Boolean).length >= 2;

  const guideColor = allGood
    ? "var(--guide-color-good)"
    : someGood
      ? "var(--guide-color-warn)"
      : "var(--guide-color-bad)";

  const statusLabel = allGood
    ? "Parfait"
    : someGood
      ? "Ajustez..."
      : "Positionnez-vous";

  return (
    <div className="face-guide" aria-label="Guide de positionnement du visage">
      <svg
        className="face-guide__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Oval face outline */}
        <ellipse
          className={`face-guide__oval ${allGood ? "face-guide__oval--good" : ""}`}
          cx="50"
          cy="48"
          rx="28"
          ry="38"
          fill="none"
          stroke={guideColor}
          strokeWidth="1.5"
          strokeDasharray={allGood ? "0" : "4 2"}
        />

        {/* Eye line guide */}
        <line
          className="face-guide__eye-line"
          x1="24"
          y1="40"
          x2="76"
          y2="40"
          stroke={guideColor}
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* Center vertical line */}
        <line
          className="face-guide__center-line"
          x1="50"
          y1="12"
          x2="50"
          y2="88"
          stroke={guideColor}
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* Corner brackets */}
        {/* Top-left */}
        <polyline
          points="8,18 8,8 18,8"
          fill="none"
          stroke={guideColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Top-right */}
        <polyline
          points="82,8 92,8 92,18"
          fill="none"
          stroke={guideColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Bottom-left */}
        <polyline
          points="8,82 8,92 18,92"
          fill="none"
          stroke={guideColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Bottom-right */}
        <polyline
          points="82,92 92,92 92,82"
          fill="none"
          stroke={guideColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Live face position indicator dot */}
        {position && (
          <circle
            cx={position.centerX * 100}
            cy={position.centerY * 100}
            r="1.5"
            fill={guideColor}
            opacity="0.8"
          />
        )}

        {/* Checkmark when all good */}
        {allGood && (
          <polyline
            className="face-guide__check"
            points="42,49 47,54 58,43"
            fill="none"
            stroke={guideColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      <div
        className="face-guide__status"
        style={{ color: guideColor }}
        role="status"
        aria-live="polite"
      >
        <span
          className={`face-guide__status-dot ${
            allGood
              ? "face-guide__status-dot--good"
              : someGood
                ? "face-guide__status-dot--warn"
                : "face-guide__status-dot--bad"
          }`}
        />
        {statusLabel}
      </div>

      <div
        className="face-guide__indicators"
        aria-label="Indicateurs de position"
      >
        <span
          className={`face-guide__indicator ${isAligned ? "face-guide__indicator--ok" : ""}`}
          title="Alignement"
        >
          ↔ Aligné
        </span>
        <span
          className={`face-guide__indicator ${isCentered ? "face-guide__indicator--ok" : ""}`}
          title="Centré"
        >
          ⊕ Centré
        </span>
        <span
          className={`face-guide__indicator ${isCorrectDistance ? "face-guide__indicator--ok" : ""}`}
          title="Distance"
        >
          ↕ Distance
        </span>
      </div>
    </div>
  );
};
