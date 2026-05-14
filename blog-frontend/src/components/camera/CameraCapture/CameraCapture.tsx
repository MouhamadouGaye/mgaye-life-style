// // frontend/src/components/CameraCapture/CameraCapture.tsx
// import React, { useRef, useEffect, useState, useCallback } from "react";
// import { FaceMesh } from "@mediapipe/face_mesh";
// export type { Results } from "@mediapipe/face_mesh";
// import type { FaceGuide, FacePosition } from "../FaceGuide/FaceGuide";

// import { CaptureButton } from "./CaptureButton";
// import { QualityIndicator } from "./QualityIndicator";
// import "./CameraCapture.css";
// import type { Camera } from "@mediapipe/camera_utils";

// interface CameraCaptureProps {
//   onCapture: (imageData: string, metadata: PhotoMetadata) => void;
//   onError: (error: Error) => void;
// }

// interface PhotoMetadata {
//   brightness: number;
//   symmetryScore: number;
//   faceSize: number;
//   timestamp: string;
// }

// interface FaceAnalysis {
//   position: FacePosition;
//   isAligned: boolean;
//   isCentered: boolean;
//   isCorrectDistance: boolean;
//   brightnessOk: boolean;
//   symmetryScore: number;
//   brightness: number;
//   instructions: string[];
// }

// export const CameraCapture: React.FC<CameraCaptureProps> = ({
//   onCapture,
//   onError,
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

//   const [isReady, setIsReady] = useState(false);
//   const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null);
//   const [canCapture, setCanCapture] = useState(false);
//   const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
//   const [exposureCompensation, setExposureCompensation] = useState(0);

//   const faceMeshRef = useRef<FaceMesh | null>(null);
//   const cameraRef = useRef<Camera | null>(null);
//   const frameCountRef = useRef(0);
//   const stableFramesRef = useRef(0);

//   // Points clés pour l'analyse faciale (indices MediaPipe Face Mesh)
//   const FACE_LANDMARKS = {
//     noseTip: 1,
//     leftEye: 33,
//     rightEye: 263,
//     leftEyeOuter: 130,
//     rightEyeOuter: 359,
//     leftCheek: 234,
//     rightCheek: 454,
//     chin: 152,
//     forehead: 10,
//     leftEar: 234,
//     rightEar: 454,
//   };

//   // Analyse de la luminosité adaptée aux peaux foncées
//   const analyzeBrightness = useCallback((imageData: ImageData): number => {
//     const data = imageData.data;
//     let totalLuminance = 0;
//     let skinPixels = 0;

//     // Échantillonnage pour performance
//     const step = 4;

//     for (let i = 0; i < data.length; i += 4 * step) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];

//       // Détection approximative de pixels de peau (toutes teintes)
//       const isSkinTone = detectSkinTone(r, g, b);

//       if (isSkinTone) {
//         // Luminance perceptuelle (formule ITU-R BT.709)
//         const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
//         totalLuminance += luminance;
//         skinPixels++;
//       }
//     }

//     if (skinPixels === 0) return 0.5;

//     const avgLuminance = totalLuminance / skinPixels / 255;

//     // Ajustement pour peaux foncées : on accepte une luminance plus basse
//     // tout en s'assurant que les détails sont visibles
//     return avgLuminance;
//   }, []);

//   // Détection de teinte de peau (algorithme adapté toutes ethnies)
//   const detectSkinTone = (r: number, g: number, b: number): boolean => {
//     // Conversion en YCbCr pour meilleure détection
//     const y = 0.299 * r + 0.587 * g + 0.114 * b;
//     const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
//     const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

//     // Plage étendue pour inclure toutes les teintes de peau
//     return (
//       y > 40 && // Minimum pour peaux très foncées
//       cb > 77 &&
//       cb < 127 &&
//       cr > 133 &&
//       cr < 180
//     );
//   };

//   // Analyse complète du visage
//   const analyzeFace = useCallback(
//     (results: Results, canvas: HTMLCanvasElement): FaceAnalysis | null => {
//       if (
//         !results.multiFaceLandmarks ||
//         results.multiFaceLandmarks.length === 0
//       ) {
//         return null;
//       }

//       const landmarks = results.multiFaceLandmarks[0];
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return null;

//       const width = canvas.width;
//       const height = canvas.height;

//       // Extraction des points clés
//       const noseTip = landmarks[FACE_LANDMARKS.noseTip];
//       const leftEye = landmarks[FACE_LANDMARKS.leftEye];
//       const rightEye = landmarks[FACE_LANDMARKS.rightEye];
//       const chin = landmarks[FACE_LANDMARKS.chin];
//       const forehead = landmarks[FACE_LANDMARKS.forehead];
//       const leftCheek = landmarks[FACE_LANDMARKS.leftCheek];
//       const rightCheek = landmarks[FACE_LANDMARKS.rightCheek];

//       // Calcul du centrage
//       const faceCenterX = noseTip.x;
//       const faceCenterY = (forehead.y + chin.y) / 2;
//       const isCentered =
//         Math.abs(faceCenterX - 0.5) < 0.08 &&
//         Math.abs(faceCenterY - 0.45) < 0.1;

//       // Calcul de la taille du visage
//       const faceHeight = Math.abs(chin.y - forehead.y);
//       const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
//       const isCorrectDistance =
//         faceHeight > 0.35 &&
//         faceHeight < 0.55 &&
//         faceWidth > 0.25 &&
//         faceWidth < 0.45;

//       // Calcul de l'alignement (inclinaison)
//       const eyeLineAngle =
//         Math.atan2(
//           (rightEye.y - leftEye.y) * height,
//           (rightEye.x - leftEye.x) * width,
//         ) *
//         (180 / Math.PI);
//       const isAligned = Math.abs(eyeLineAngle) < 5;

//       // Calcul de la symétrie
//       const leftDistance = Math.abs(noseTip.x - leftEye.x);
//       const rightDistance = Math.abs(rightEye.x - noseTip.x);
//       const symmetryScore =
//         1 -
//         Math.abs(leftDistance - rightDistance) /
//           Math.max(leftDistance, rightDistance);

//       // Analyse de la luminosité
//       const imageData = ctx.getImageData(0, 0, width, height);
//       const brightness = analyzeBrightness(imageData);

//       // Seuils adaptés pour peaux foncées
//       const minBrightness = 0.15; // Plus bas pour peaux foncées
//       const maxBrightness = 0.85;
//       const brightnessOk =
//         brightness >= minBrightness && brightness <= maxBrightness;

//       // Génération des instructions
//       const instructions: string[] = [];

//       if (!isCentered) {
//         if (faceCenterX < 0.42)
//           instructions.push("Déplacez-vous vers la droite");
//         else if (faceCenterX > 0.58)
//           instructions.push("Déplacez-vous vers la gauche");
//         if (faceCenterY < 0.35) instructions.push("Baissez légèrement la tête");
//         else if (faceCenterY > 0.55)
//           instructions.push("Levez légèrement la tête");
//       }

//       if (!isCorrectDistance) {
//         if (faceHeight < 0.35)
//           instructions.push("Rapprochez-vous de la caméra");
//         else if (faceHeight > 0.55)
//           instructions.push("Éloignez-vous de la caméra");
//       }

//       if (!isAligned) {
//         if (eyeLineAngle > 5)
//           instructions.push("Inclinez la tête vers la gauche");
//         else if (eyeLineAngle < -5)
//           instructions.push("Inclinez la tête vers la droite");
//       }

//       if (!brightnessOk) {
//         if (brightness < minBrightness)
//           instructions.push("Améliorez l'éclairage");
//         else instructions.push("Réduisez la lumière directe");
//       }

//       return {
//         position: {
//           centerX: faceCenterX,
//           centerY: faceCenterY,
//           faceWidth,
//           faceHeight,
//           rotation: eyeLineAngle,
//         },
//         isAligned,
//         isCentered,
//         isCorrectDistance,
//         brightnessOk,
//         symmetryScore,
//         brightness,
//         instructions,
//       };
//     },
//     [analyzeBrightness],
//   );

//   // Initialisation de MediaPipe Face Mesh
//   useEffect(() => {
//     const initFaceMesh = async () => {
//       try {
//         const faceMesh = new FaceMesh({
//           locateFile: (file) =>
//             `[cdn.jsdelivr.net](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file})`,
//         });

//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5,
//         });

//         faceMesh.onResults((results) => {
//           frameCountRef.current++;

//           // Analyse toutes les 2 frames pour performance
//           if (frameCountRef.current % 2 !== 0) return;

//           const canvas = canvasRef.current;
//           const overlayCanvas = overlayCanvasRef.current;
//           if (!canvas || !overlayCanvas) return;

//           const ctx = canvas.getContext("2d");
//           const overlayCtx = overlayCanvas.getContext("2d");
//           if (!ctx || !overlayCtx) return;

//           // Dessiner l'image sur le canvas
//           ctx.save();
//           ctx.scale(-1, 1);
//           ctx.drawImage(
//             results.image,
//             -canvas.width,
//             0,
//             canvas.width,
//             canvas.height,
//           );
//           ctx.restore();

//           // Analyser le visage
//           const analysis = analyzeFace(results, canvas);
//           setFaceAnalysis(analysis);

//           if (analysis) {
//             const allConditionsMet =
//               analysis.isAligned &&
//               analysis.isCentered &&
//               analysis.isCorrectDistance &&
//               analysis.brightnessOk &&
//               analysis.symmetryScore > 0.85;

//             if (allConditionsMet) {
//               stableFramesRef.current++;
//               if (stableFramesRef.current >= 15) {
//                 // ~0.5s de stabilité
//                 setCanCapture(true);
//               }
//             } else {
//               stableFramesRef.current = 0;
//               setCanCapture(false);
//             }
//           } else {
//             stableFramesRef.current = 0;
//             setCanCapture(false);
//           }

//           // Dessiner le guide sur l'overlay
//           drawGuide(
//             overlayCtx,
//             overlayCanvas.width,
//             overlayCanvas.height,
//             analysis,
//           );
//         });

//         await faceMesh.initialize();
//         faceMeshRef.current = faceMesh;
//         setIsReady(true);
//       } catch (error) {
//         onError(error as Error);
//       }
//     };

//     initFaceMesh();

//     return () => {
//       if (cameraRef.current) {
//         cameraRef.current.stop();
//       }
//     };
//   }, [analyzeFace, onError]);

//   // Démarrage de la caméra
//   useEffect(() => {
//     if (!isReady || !videoRef.current || !faceMeshRef.current) return;

//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: "user",
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//             frameRate: { ideal: 30 },
//           },
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;

//           // Tentative d'ajustement de l'exposition si supporté
//           const track = stream.getVideoTracks()[0];
//           const capabilities =
//             track.getCapabilities?.() as MediaTrackCapabilities & {
//               exposureCompensation?: { min: number; max: number };
//             };

//           if (capabilities?.exposureCompensation) {
//             const settings = track.getSettings?.() as MediaTrackSettings & {
//               exposureCompensation?: number;
//             };
//             // Augmenter légèrement l'exposition pour mieux capturer les peaux foncées
//             const newExposure = Math.min(
//               (capabilities.exposureCompensation.max +
//                 capabilities.exposureCompensation.min) /
//                 2 +
//                 0.5,
//               capabilities.exposureCompensation.max,
//             );
//             await track.applyConstraints?.({
//               advanced: [
//                 {
//                   exposureCompensation: newExposure,
//                 } as MediaTrackConstraintSet,
//               ],
//             });
//             setExposureCompensation(newExposure);
//           }
//         }

//         const camera = new Camera(videoRef.current!, {
//           onFrame: async () => {
//             if (faceMeshRef.current && videoRef.current) {
//               await faceMeshRef.current.send({ image: videoRef.current });
//             }
//           },
//           width: 1280,
//           height: 720,
//         });

//         await camera.start();
//         cameraRef.current = camera;
//       } catch (error) {
//         onError(error as Error);
//       }
//     };

//     startCamera();
//   }, [isReady, onError]);

//   // Dessin du guide facial
//   const drawGuide = (
//     ctx: CanvasRenderingContext2D,
//     width: number,
//     height: number,
//     analysis: FaceAnalysis | null,
//   ) => {
//     ctx.clearRect(0, 0, width, height);

//     // Zone ovale pour le visage
//     const centerX = width / 2;
//     const centerY = height * 0.42;
//     const ovalWidth = width * 0.35;
//     const ovalHeight = height * 0.48;

//     // Couleur du guide selon l'état
//     let guideColor = "#ffffff";
//     let glowIntensity = 0;

//     if (analysis) {
//       const score = [
//         analysis.isAligned,
//         analysis.isCentered,
//         analysis.isCorrectDistance,
//         analysis.brightnessOk,
//       ].filter(Boolean).length;

//       if (score === 4 && analysis.symmetryScore > 0.85) {
//         guideColor = "#22c55e"; // Vert
//         glowIntensity = 20;
//       } else if (score >= 2) {
//         guideColor = "#f59e0b"; // Orange
//         glowIntensity = 10;
//       } else {
//         guideColor = "#ef4444"; // Rouge
//         glowIntensity = 5;
//       }
//     }

//     // Effet de lueur
//     if (glowIntensity > 0) {
//       ctx.shadowColor = guideColor;
//       ctx.shadowBlur = glowIntensity;
//     }

//     // Dessiner l'ovale
//     ctx.strokeStyle = guideColor;
//     ctx.lineWidth = 3;
//     ctx.beginPath();
//     ctx.ellipse(centerX, centerY, ovalWidth, ovalHeight, 0, 0, 2 * Math.PI);
//     ctx.stroke();

//     // Réinitialiser l'ombre
//     ctx.shadowBlur = 0;

//     // Lignes de guidage pour les yeux
//     const eyeLineY = centerY - ovalHeight * 0.15;
//     ctx.setLineDash([5, 5]);
//     ctx.strokeStyle = `${guideColor}80`;
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(centerX - ovalWidth * 0.7, eyeLineY);
//     ctx.lineTo(centerX + ovalWidth * 0.7, eyeLineY);
//     ctx.stroke();
//     ctx.setLineDash([]);

//     // Ligne centrale verticale
//     ctx.beginPath();
//     ctx.moveTo(centerX, centerY - ovalHeight * 0.8);
//     ctx.lineTo(centerX, centerY + ovalHeight * 0.8);
//     ctx.stroke();

//     // Coins pour le cadrage
//     const cornerSize = 30;
//     const padding = 40;
//     ctx.strokeStyle = guideColor;
//     ctx.lineWidth = 3;
//     ctx.setLineDash([]);

//     // Coin supérieur gauche
//     ctx.beginPath();
//     ctx.moveTo(padding, padding + cornerSize);
//     ctx.lineTo(padding, padding);
//     ctx.lineTo(padding + cornerSize, padding);
//     ctx.stroke();

//     // Coin supérieur droit
//     ctx.beginPath();
//     ctx.moveTo(width - padding - cornerSize, padding);
//     ctx.lineTo(width - padding, padding);
//     ctx.lineTo(width - padding, padding + cornerSize);
//     ctx.stroke();

//     // Coin inférieur gauche
//     ctx.beginPath();
//     ctx.moveTo(padding, height - padding - cornerSize);
//     ctx.lineTo(padding, height - padding);
//     ctx.lineTo(padding + cornerSize, height - padding);
//     ctx.stroke();

//     // Coin inférieur droit
//     ctx.beginPath();
//     ctx.moveTo(width - padding - cornerSize, height - padding);
//     ctx.lineTo(width - padding, height - padding);
//     ctx.lineTo(width - padding, height - padding - cornerSize);
//     ctx.stroke();
//   };

//   // Capture de la photo
//   const handleCapture = useCallback(() => {
//     if (!canCapture || !canvasRef.current || !faceAnalysis) return;

//     setCaptureCountdown(3);

//     const countdown = setInterval(() => {
//       setCaptureCountdown((prev) => {
//         if (prev === null || prev <= 1) {
//           clearInterval(countdown);

//           // Effectuer la capture
//           const canvas = canvasRef.current!;
//           const imageData = canvas.toDataURL("image/jpeg", 0.95);

//           const metadata: PhotoMetadata = {
//             brightness: faceAnalysis.brightness,
//             symmetryScore: faceAnalysis.symmetryScore,
//             faceSize: faceAnalysis.position.faceHeight,
//             timestamp: new Date().toISOString(),
//           };

//           onCapture(imageData, metadata);
//           return null;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }, [canCapture, faceAnalysis, onCapture]);

//   // Capture automatique quand toutes les conditions sont remplies
//   useEffect(() => {
//     if (canCapture && stableFramesRef.current >= 30) {
//       // ~1s de stabilité pour auto-capture
//       handleCapture();
//     }
//   }, [canCapture, handleCapture]);

//   return (
//     <div className="camera-capture">
//       <div className="camera-container">
//         <video
//           ref={videoRef}
//           className="camera-video"
//           playsInline
//           muted
//           autoPlay
//         />
//         <canvas
//           ref={canvasRef}
//           className="camera-canvas"
//           width={1280}
//           height={720}
//         />
//         <canvas
//           ref={overlayCanvasRef}
//           className="overlay-canvas"
//           width={1280}
//           height={720}
//         />

//         {captureCountdown !== null && (
//           <div className="countdown-overlay">
//             <span className="countdown-number">{captureCountdown}</span>
//           </div>
//         )}
//       </div>

//       <div className="controls-panel">
//         <QualityIndicator analysis={faceAnalysis} />

//         <div className="instructions">
//           {faceAnalysis?.instructions.length ? (
//             <ul>
//               {faceAnalysis.instructions.map((instruction, index) => (
//                 <li key={index}>{instruction}</li>
//               ))}
//             </ul>
//           ) : faceAnalysis ? (
//             <p className="ready-message">
//               Position parfaite ! Restez immobile...
//             </p>
//           ) : (
//             <p>Placez votre visage dans le cadre ovale</p>
//           )}
//         </div>

//         <CaptureButton
//           onClick={handleCapture}
//           disabled={!canCapture}
//           isReady={canCapture}
//         />
//       </div>
//     </div>
//   );
// };

import React, { useRef, useEffect, useState, useCallback } from "react";
import type { Results } from "@mediapipe/face_mesh";
import type { FacePosition } from "../FaceGuide/FaceGuide";
import { CaptureButton } from "./CaptureButton";
import { QualityIndicator } from "./QualityIndicator";
import "./CameraCapture.css";

interface CameraCaptureProps {
  onCapture: (imageData: string, metadata: PhotoMetadata) => void;
  onError: (error: Error) => void;
}

interface PhotoMetadata {
  brightness: number;
  symmetryScore: number;
  faceSize: number;
  timestamp: string;
}

interface FaceAnalysis {
  position: FacePosition;
  isAligned: boolean;
  isCentered: boolean;
  isCorrectDistance: boolean;
  brightnessOk: boolean;
  symmetryScore: number;
  brightness: number;
  instructions: string[];
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null);
  const [canCapture, setCanCapture] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);

  // FaceMesh and Camera come from window globals via index.html CDN scripts
  const faceMeshRef = useRef<InstanceType<typeof window.FaceMesh> | null>(null);
  const cameraRef = useRef<InstanceType<typeof window.Camera> | null>(null);
  const frameCountRef = useRef(0);
  const stableFramesRef = useRef(0);

  const FACE_LANDMARKS = {
    noseTip: 1,
    leftEye: 33,
    rightEye: 263,
    leftCheek: 234,
    rightCheek: 454,
    chin: 152,
    forehead: 10,
  };

  const detectSkinTone = (r: number, g: number, b: number): boolean => {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    return y > 40 && cb > 77 && cb < 127 && cr > 133 && cr < 180;
  };

  const analyzeBrightness = useCallback((imageData: ImageData): number => {
    const data = imageData.data;
    let totalLuminance = 0;
    let skinPixels = 0;
    const step = 4;

    for (let i = 0; i < data.length; i += 4 * step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (detectSkinTone(r, g, b)) {
        totalLuminance += 0.2126 * r + 0.7152 * g + 0.0722 * b;
        skinPixels++;
      }
    }

    if (skinPixels === 0) return 0.5;
    return totalLuminance / skinPixels / 255;
  }, []);

  const analyzeFace = useCallback(
    (results: Results, canvas: HTMLCanvasElement): FaceAnalysis | null => {
      if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
      ) {
        return null;
      }

      const landmarks = results.multiFaceLandmarks[0];
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const { width, height } = canvas;

      const noseTip = landmarks[FACE_LANDMARKS.noseTip];
      const leftEye = landmarks[FACE_LANDMARKS.leftEye];
      const rightEye = landmarks[FACE_LANDMARKS.rightEye];
      const chin = landmarks[FACE_LANDMARKS.chin];
      const forehead = landmarks[FACE_LANDMARKS.forehead];
      const leftCheek = landmarks[FACE_LANDMARKS.leftCheek];
      const rightCheek = landmarks[FACE_LANDMARKS.rightCheek];

      const faceCenterX = noseTip.x;
      const faceCenterY = (forehead.y + chin.y) / 2;
      const isCentered =
        Math.abs(faceCenterX - 0.5) < 0.08 &&
        Math.abs(faceCenterY - 0.45) < 0.1;

      const faceHeight = Math.abs(chin.y - forehead.y);
      const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
      const isCorrectDistance =
        faceHeight > 0.35 &&
        faceHeight < 0.55 &&
        faceWidth > 0.25 &&
        faceWidth < 0.45;

      const eyeLineAngle =
        Math.atan2(
          (rightEye.y - leftEye.y) * height,
          (rightEye.x - leftEye.x) * width,
        ) *
        (180 / Math.PI);
      const isAligned = Math.abs(eyeLineAngle) < 5;

      const leftDistance = Math.abs(noseTip.x - leftEye.x);
      const rightDistance = Math.abs(rightEye.x - noseTip.x);
      const symmetryScore =
        1 -
        Math.abs(leftDistance - rightDistance) /
          Math.max(leftDistance, rightDistance);

      const imageData = ctx.getImageData(0, 0, width, height);
      const brightness = analyzeBrightness(imageData);
      const brightnessOk = brightness >= 0.15 && brightness <= 0.85;

      const instructions: string[] = [];

      if (!isCentered) {
        if (faceCenterX < 0.42)
          instructions.push("Déplacez-vous vers la droite");
        else if (faceCenterX > 0.58)
          instructions.push("Déplacez-vous vers la gauche");
        if (faceCenterY < 0.35) instructions.push("Baissez légèrement la tête");
        else if (faceCenterY > 0.55)
          instructions.push("Levez légèrement la tête");
      }
      if (!isCorrectDistance) {
        if (faceHeight < 0.35)
          instructions.push("Rapprochez-vous de la caméra");
        else instructions.push("Éloignez-vous de la caméra");
      }
      if (!isAligned) {
        if (eyeLineAngle > 5)
          instructions.push("Inclinez la tête vers la gauche");
        else instructions.push("Inclinez la tête vers la droite");
      }
      if (!brightnessOk) {
        if (brightness < 0.15) instructions.push("Améliorez l'éclairage");
        else instructions.push("Réduisez la lumière directe");
      }

      return {
        position: {
          centerX: faceCenterX,
          centerY: faceCenterY,
          faceWidth,
          faceHeight,
          rotation: eyeLineAngle,
        },
        isAligned,
        isCentered,
        isCorrectDistance,
        brightnessOk,
        symmetryScore,
        brightness,
        instructions,
      };
    },
    [analyzeBrightness],
  );

  const drawGuide = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    analysis: FaceAnalysis | null,
  ) => {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.42;
    const ovalWidth = width * 0.35;
    const ovalHeight = height * 0.48;

    let guideColor = "#ffffff";
    let glowIntensity = 0;

    if (analysis) {
      const score = [
        analysis.isAligned,
        analysis.isCentered,
        analysis.isCorrectDistance,
        analysis.brightnessOk,
      ].filter(Boolean).length;

      if (score === 4 && analysis.symmetryScore > 0.85) {
        guideColor = "#22c55e";
        glowIntensity = 20;
      } else if (score >= 2) {
        guideColor = "#f59e0b";
        glowIntensity = 10;
      } else {
        guideColor = "#ef4444";
        glowIntensity = 5;
      }
    }

    if (glowIntensity > 0) {
      ctx.shadowColor = guideColor;
      ctx.shadowBlur = glowIntensity;
    }

    ctx.strokeStyle = guideColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, ovalWidth, ovalHeight, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const eyeLineY = centerY - ovalHeight * 0.15;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = `${guideColor}80`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - ovalWidth * 0.7, eyeLineY);
    ctx.lineTo(centerX + ovalWidth * 0.7, eyeLineY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - ovalHeight * 0.8);
    ctx.lineTo(centerX, centerY + ovalHeight * 0.8);
    ctx.stroke();

    const cornerSize = 30;
    const padding = 40;
    ctx.strokeStyle = guideColor;
    ctx.lineWidth = 3;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(padding, padding + cornerSize);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + cornerSize, padding);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - padding - cornerSize, padding);
    ctx.lineTo(width - padding, padding);
    ctx.lineTo(width - padding, padding + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - cornerSize);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(padding + cornerSize, height - padding);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - padding - cornerSize, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding, height - padding - cornerSize);
    ctx.stroke();
  };

  // ── Init FaceMesh ──────────────────────────────────────────────────
  useEffect(() => {
    const initFaceMesh = async () => {
      try {
        // FaceMesh is a window global loaded from index.html CDN script
        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults((results: Results) => {
          frameCountRef.current++;
          if (frameCountRef.current % 2 !== 0) return;

          const canvas = canvasRef.current;
          const overlayCanvas = overlayCanvasRef.current;
          if (!canvas || !overlayCanvas) return;

          const ctx = canvas.getContext("2d");
          const overlayCtx = overlayCanvas.getContext("2d");
          if (!ctx || !overlayCtx) return;

          // FIX: draw the video frame mirrored onto the visible canvas
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          const analysis = analyzeFace(results, canvas);
          setFaceAnalysis(analysis);

          if (analysis) {
            const allConditionsMet =
              analysis.isAligned &&
              analysis.isCentered &&
              analysis.isCorrectDistance &&
              analysis.brightnessOk &&
              analysis.symmetryScore > 0.85;

            if (allConditionsMet) {
              stableFramesRef.current++;
              if (stableFramesRef.current >= 15) setCanCapture(true);
            } else {
              stableFramesRef.current = 0;
              setCanCapture(false);
            }
          } else {
            stableFramesRef.current = 0;
            setCanCapture(false);
          }

          drawGuide(
            overlayCtx,
            overlayCanvas.width,
            overlayCanvas.height,
            analysis,
          );
        });

        await faceMesh.initialize();
        faceMeshRef.current = faceMesh;
        setIsReady(true);
      } catch (error) {
        onError(error as Error);
      }
    };

    initFaceMesh();

    return () => {
      cameraRef.current?.stop();
    };
  }, [analyzeFace, onError]);

  // ── Start Camera ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !videoRef.current || !faceMeshRef.current) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          const track = stream.getVideoTracks()[0];
          const capabilities =
            track.getCapabilities?.() as MediaTrackCapabilities & {
              exposureCompensation?: { min: number; max: number };
            };

          if (capabilities?.exposureCompensation) {
            const newExposure = Math.min(
              (capabilities.exposureCompensation.max +
                capabilities.exposureCompensation.min) /
                2 +
                0.5,
              capabilities.exposureCompensation.max,
            );
            await track.applyConstraints?.({
              advanced: [
                {
                  exposureCompensation: newExposure,
                } as MediaTrackConstraintSet,
              ],
            });
          }
        }

        // Camera is a window global loaded from index.html CDN script
        const camera = new window.Camera(videoRef.current!, {
          onFrame: async () => {
            if (faceMeshRef.current && videoRef.current) {
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
        });

        await camera.start();
        cameraRef.current = camera;
      } catch (error) {
        onError(error as Error);
      }
    };

    startCamera();
  }, [isReady, onError]);

  // ── Capture ────────────────────────────────────────────────────────
  const handleCapture = useCallback(() => {
    if (!canCapture || !canvasRef.current || !faceAnalysis) return;

    setCaptureCountdown(3);

    const countdown = setInterval(() => {
      setCaptureCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown);

          const canvas = canvasRef.current!;
          const imageData = canvas.toDataURL("image/jpeg", 0.95);

          onCapture(imageData, {
            brightness: faceAnalysis.brightness,
            symmetryScore: faceAnalysis.symmetryScore,
            faceSize: faceAnalysis.position.faceHeight,
            timestamp: new Date().toISOString(),
          });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [canCapture, faceAnalysis, onCapture]);

  useEffect(() => {
    if (canCapture && stableFramesRef.current >= 30) handleCapture();
  }, [canCapture, handleCapture]);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="camera-capture">
      <div className="camera-container">
        {/* video is hidden — Camera utility drives it internally */}
        <video
          ref={videoRef}
          className="camera-video"
          playsInline
          muted
          autoPlay
          style={{ display: "none" }}
        />
        <canvas
          ref={canvasRef}
          className="camera-canvas"
          width={1280}
          height={720}
        />
        <canvas
          ref={overlayCanvasRef}
          className="overlay-canvas"
          width={1280}
          height={720}
        />

        {captureCountdown !== null && (
          <div className="countdown-overlay">
            <span className="countdown-number">{captureCountdown}</span>
          </div>
        )}
      </div>
      <div className="controls-panel">
        <QualityIndicator analysis={faceAnalysis} />

        <div className="instructions">
          {faceAnalysis?.instructions.length ? (
            <ul>
              {faceAnalysis.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          ) : faceAnalysis ? (
            <p className="ready-message">
              Position parfaite ! Restez immobile...
            </p>
          ) : (
            <p>Placez votre visage dans le cadre ovale</p>
          )}
        </div>

        <CaptureButton
          onClick={handleCapture}
          disabled={!canCapture}
          isReady={canCapture}
        />
      </div>
    </div>
  );
};
