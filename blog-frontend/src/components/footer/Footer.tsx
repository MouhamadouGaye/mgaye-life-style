import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* BRAND */}
        <div className="footer-brand">
          <h2>🇸🇳 Demarches.sn</h2>
          <p>Simplifiez toutes vos démarches administratives au Sénégal.</p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div>
            <h4>Démarches</h4>
            <Link to="/cni">Carte d’identité</Link>
            <Link to="/passeport">Passeport</Link>
            <Link to="/casier">Casier judiciaire</Link>
          </div>

          <div>
            <h4>Explorer</h4>
            <Link to="/regions">Régions</Link>
            <Link to="/demarches">Toutes les démarches</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div>
            <h4>Support</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/aide">Centre d’aide</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 Demarches.sn — Tous droits réservés</p>
      </div>
    </footer>
  );
}
