// import { Link } from "react-router-dom";
// import "./Header.css";
// import { MapPin, FileText, Search, User } from "lucide-react";

// export default function Header() {
//   return (
//     <header className="header">
//       <div className="header-inner">
//         {/* LOGO */}
//         <Link to="/" className="logo">
//           🇸🇳 Demarches.sn
//         </Link>

//         {/* NAV */}
//         <nav className="nav">
//           <Link to="/regions">
//             <MapPin size={18} /> Régions
//           </Link>
//           <Link to="/demarches">
//             <FileText size={18} /> Démarches
//           </Link>
//           <Link to="/suivi">
//             <Search size={18} /> Suivi
//           </Link>
//         </nav>

//         {/* CTA */}
//         <div className="actions">
//           <Link to="/compte" className="login">
//             <User size={18} /> Compte
//           </Link>

//           <Link to="/commencer" className="cta">
//             Commencer
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  FileText,
  Search,
  User,
  CreditCard,
  FileBadge,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          🇸🇳 Demarches.sn
        </Link>

        <nav className="nav">
          {/* DEMARCHES */}
          <div className="nav-item">
            <span>
              <FileText size={18} /> Démarches
            </span>

            <div className="mega-menu">
              <div className="mega-grid">
                <Link to="/demarches/cni" className="mega-card">
                  <CreditCard />
                  <div>
                    <h4>Carte d’identité</h4>
                    <p>Faire ou renouveler votre CNI</p>
                  </div>
                </Link>

                <Link to="/demarches/passeport" className="mega-card">
                  <FileBadge />
                  <div>
                    <h4>Passeport</h4>
                    <p>Voyagez en toute sécurité</p>
                  </div>
                </Link>

                <Link to="/demarches/casier" className="mega-card">
                  <ShieldCheck />
                  <div>
                    <h4>Casier judiciaire</h4>
                    <p>Demande en ligne rapide</p>
                  </div>
                </Link>

                <Link to="/demarches/naissance" className="mega-card">
                  <FileText />
                  <div>
                    <h4>Extrait de naissance</h4>
                    <p>Document officiel essentiel</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* REGIONS */}
          <div className="nav-item">
            <span>
              <MapPin size={18} /> Régions
            </span>

            <div className="mega-menu medium">
              <div className="mega-grid regions">
                {[
                  "Dakar",
                  "Diourbel",
                  "Fatick",
                  "kolda",
                  "Louga",
                  "Tambacounda",
                  "Matam",
                  "Thiès",
                  "Saint-Louis",
                  "Ziguinchor",
                  "Kaffrine",
                  "Kédougou",
                ].map((r) => (
                  <Link
                    key={r}
                    to={`/${r.toLowerCase()}/demarches`}
                    className="mega-link"
                  >
                    {r}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* GUIDES */}
          <div className="nav-item">
            <span>
              <BookOpen size={18} /> Guides
            </span>

            <div className="mega-menu small">
              <Link to="/guides/cni">Comment faire une CNI</Link>
              <Link to="/guides/documents">Documents requis</Link>
              <Link to="/guides/conseils">Conseils pratiques</Link>
            </div>
          </div>

          <Link to="/suivi" className="simple-link">
            <Search size={18} /> Suivi
          </Link>
        </nav>

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
