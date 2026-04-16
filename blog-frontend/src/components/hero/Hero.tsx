import { LocalisationIcon } from "../icon/LocalisationIcon";
import { UserCheckIcon } from "../icon/UserCheckIcon";
import { GradientLine } from "../line/GradientLine";
import "./Hero.css";
import { FileText, MapPin, Search } from "lucide-react";

export default function Hero() {
  const bubbles = [
    "Carte d’identité",
    "Passeport",
    "Acte de naissance",
    "Certificat de résidence",
    "Suivi dossier",
  ];

  return (
    <section className="hero">
      {/* <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#ffe6e6" />{" "}
        <path
          d="M 100 50 Q 130 70 130 95 Q 130 115 100 130 Q 70 115 70 95 Q 70 70 100 50"
          fill="#CE1126"
        />{" "}
        <path
          d="M 100 60 Q 120 75 120 95 Q 120 110 100 120 Q 80 110 80 95 Q 80 75 100 60"
          fill="#ff6b6b"
        />{" "}
        <circle cx="90" cy="90" r="5" fill="white" opacity="0.6" />{" "}
        <circle cx="110" cy="85" r="4" fill="white" opacity="0.5" />{" "}
        <path
          d="M 60 130 Q 100 160 140 130"
          stroke="#228B22"
          stroke-width="2"
          fill="none"
        />{" "}
        <circle cx="75" cy="145" r="8" fill="#FCD116" />{" "}
        <circle cx="125" cy="145" r="8" fill="#FCD116" />
      </svg> */}
      {/* <svg viewBox="0 0 200 200" className="w-full h-full"><circle cx="100" cy="60" r="35" fill="#FCD116" /> <circle cx="100" cy="60" r="30" fill="#f4d03f" /> <path d="M 100 15 L 110 45 L 140 45 L 115 65 L 125 95 L 100 75 L 75 95 L 85 65 L 60 45 L 90 45 Z" fill="#FCD116" /> <path d="M 50 140 Q 100 180 150 140" stroke="#228B22" strokeWidth="3" fill="none" strokeLinecap="round" /> <rect x="70" y="130" width="12" height="35" fill="#228B22" rx="6" /> <rect x="118" y="130" width="12" height="35" fill="#228B22" rx="6" /></svg> */}
      {/* <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="85" fill="#ffe6e6" />{" "}
        <path
          d="M 100 50 Q 130 70 130 95 Q 130 115 100 130 Q 70 115 70 95 Q 70 70 100 50"
          fill="#CE1126"
        />{" "}
        <path
          d="M 100 60 Q 120 75 120 95 Q 120 110 100 120 Q 80 110 80 95 Q 80 75 100 60"
          fill="#ff6b6b"
        />{" "}
        <circle cx="90" cy="90" r="5" fill="white" opacity="0.6" />{" "}
        <circle cx="110" cy="85" r="4" fill="white" opacity="0.5" />{" "}
        <path
          d="M 60 130 Q 100 160 140 130"
          stroke="#228B22"
          strokeWidth="2"
          fill="none"
        />{" "}
        <circle cx="75" cy="145" r="8" fill="#FCD116" />{" "}
        <circle cx="125" cy="145" r="8" fill="#FCD116"></circle>
      </svg> */}

      {/* LEFT CONTENT */}
      <div className="hero-left">
        <span className="badge">🇸🇳 Plateforme officielle simplifiée</span>
        <h1>
          Toutes vos <span>démarches administratives</span> en un seul endroit
        </h1>
        <p>
          Trouvez, comprenez et complétez vos démarches administratives sans
          vous déplacer inutilement.
        </p>
        <div style={{ display: "flex", gap: "12px", margin: "20px 0" }}>
          <div className="card-icon">
            <UserCheckIcon />
          </div>{" "}
          <div className="card-icon">
            <LocalisationIcon />
          </div>
          <div className="card-icon">
            <UserCheckIcon />
          </div>
        </div>
        <div className="hero-actions">
          <button className="primary">
            <MapPin size={18} /> Choisir ma région
          </button>

          <button className="secondary">
            <Search size={18} /> Suivre un dossier
          </button>
        </div>
        <div className="stats">
          <div>
            <strong>15</strong>
            <span>Régions</span>
          </div>
          <div>
            <strong>100+</strong>
            <span>Démarches</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Accès</span>
          </div>
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="hero-right">
        <div className="phone-mock">
          <img
            src="/assets/undraw_level-up_fenw.svg"
            alt="Illustration démarches"
            className="hero-image"
          />
          <div className="screen" />

          {bubbles.map((b, i) => (
            <div key={i} className={`bubble b${i + 1}`}>
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
