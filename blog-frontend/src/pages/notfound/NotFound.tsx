import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-container">
      <div className="nf-card">
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Page introuvable</h2>
        <p className="nf-subtitle">
          Oups… la page que vous cherchez n’existe pas ou a été déplacée.
        </p>

        <Link to="/" className="nf-btn">
          ⬅ Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}

/* ================= CSS ================= */
