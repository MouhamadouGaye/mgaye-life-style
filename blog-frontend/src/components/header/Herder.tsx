import { Link } from "react-router-dom";
import "./Header.css";
import { MapPin, FileText, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        {/* LOGO */}
        <Link to="/" className="logo">
          🇸🇳 Demarches.sn
        </Link>

        {/* NAV */}
        <nav className="nav">
          <Link to="/regions">
            <MapPin size={18} /> Régions
          </Link>
          <Link to="/demarches">
            <FileText size={18} /> Démarches
          </Link>
          <Link to="/suivi">
            <Search size={18} /> Suivi
          </Link>
        </nav>

        {/* CTA */}
        <div className="actions">
          <Link to="/compte" className="login">
            <User size={18} /> Compte
          </Link>

          <Link to="/commencer" className="cta">
            Commencer
          </Link>
        </div>
      </div>
    </header>
  );
}
