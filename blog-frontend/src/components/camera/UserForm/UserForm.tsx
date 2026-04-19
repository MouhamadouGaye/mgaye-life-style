// frontend/src/components/UserForm/UserForm.tsx
import React, { useState } from "react";
import "./UserForm.css";

interface UserFormProps {
  onSubmit: (data: { email: string; nationalId: string }) => void;
  isLoading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [errors, setErrors] = useState<{ email?: string; nationalId?: string }>(
    {},
  );

  const validate = (): boolean => {
    const newErrors: { email?: string; nationalId?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!nationalId) {
      newErrors.nationalId = "Le numéro d'identité est requis";
    } else if (nationalId.length < 5) {
      newErrors.nationalId = "Numéro d'identité trop court";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, nationalId });
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>Informations personnelles</h2>

      <div className="form-group">
        <label htmlFor="email">Adresse email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre.email@exemple.com"
          disabled={isLoading}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="nationalId">Numéro d'identité nationale</label>
        <input
          type="text"
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value.toUpperCase())}
          placeholder="ABC123456789"
          disabled={isLoading}
          className={errors.nationalId ? "error" : ""}
        />
        {errors.nationalId && (
          <span className="error-message">{errors.nationalId}</span>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Traitement..." : "Continuer vers la capture"}
      </button>
    </form>
  );
};
