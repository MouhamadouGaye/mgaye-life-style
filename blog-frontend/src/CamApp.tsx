// frontend/src/App.tsx
import React, { useState } from "react";

// import { uploadPhoto } from "./services/api";
import "./App.css";
import { CameraCapture } from "./components/camera/CameraCapture/CameraCapture";
import { UserForm } from "./components/camera/UserForm/UserForm";
import { PhotoReview } from "./components/camera/PhotoPreview/PhotoReview";
import { uploadPhoto } from "./api/api";

type Step = "form" | "capture" | "review" | "success";

interface UserData {
  email: string;
  nationalId: string;
}

interface PhotoMetadata {
  brightness: number;
  symmetryScore: number;
  faceSize: number;
  timestamp: string;
}

function CamApp() {
  const [step, setStep] = useState<Step>("form");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoMetadata, setPhotoMetadata] = useState<PhotoMetadata | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<string | null>(null);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setStep("capture");
  };

  const handleCapture = (imageData: string, metadata: PhotoMetadata) => {
    setCapturedImage(imageData);
    setPhotoMetadata(metadata);
    setStep("review");
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setPhotoMetadata(null);
    setStep("capture");
  };

  const handleConfirm = async () => {
    if (!capturedImage || !userData || !photoMetadata) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadPhoto({
        imageData: capturedImage,
        email: userData.email,
        nationalId: userData.nationalId,
        metadata: photoMetadata,
      });

      setPhotoId(result.photo.id);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureError = (err: Error) => {
    setError(err.message);
  };

  const handleReset = () => {
    setStep("form");
    setUserData(null);
    setCapturedImage(null);
    setPhotoMetadata(null);
    setPhotoId(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📷 Capture Photo d'Identité</h1>
        <p>Service sécurisé de photo d'identité numérique</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {step === "form" && (
          <UserForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {step === "capture" && (
          <CameraCapture
            onCapture={handleCapture}
            onError={handleCaptureError}
          />
        )}

        {step === "review" && capturedImage && (
          <PhotoReview
            imageData={capturedImage}
            metadata={photoMetadata}
            onRetake={handleRetake}
            onConfirm={handleConfirm}
            isLoading={isLoading}
          />
        )}

        {step === "success" && (
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h2>Photo enregistrée avec succès !</h2>
            <p>
              Identifiant de votre photo : <strong>{photoId}</strong>
            </p>
            <p>
              Email associé : <strong>{userData?.email}</strong>
            </p>
            <button onClick={handleReset} className="new-capture-button">
              Nouvelle capture
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Vos données sont protégées et sécurisées</p>
      </footer>
    </div>
  );
}

export default CamApp;
