// // src/pages/Home.tsx
// import { useNavigate } from "react-router-dom";

// import "./Home.css";

// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="page">
//       <div className="header">
//         <h1>📄 Sénégal démarches</h1>
//       </div>

//       <div className="grid">
//         {regions.map((r: any) => (
//           <div
//             className="card"
//             key={r.id}
//             onClick={() => navigate(`/${r.id}/demarches`)}
//           >
//             <h2>{r.name}</h2>
//             <p>{r.description}</p>
//             <button>Commencer</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import { MapPin, FileText, Landmark, Users } from "lucide-react";
import "./Home.css";

const regions = [
  "Dakar",
  "Thiès",
  "Saint-Louis",
  "Ziguinchor",
  "Kaolack",
  "Tambacounda",
  "Kolda",
  "Matam",
  "Fatick",
  "Kaffrine",
  "Kédougou",
  "Sédhiou",
  "Louga",
  "Diourbel",
];

export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <h1>🇸🇳 Démarches Administratives Simplifiées</h1>
        <p>
          Accédez rapidement à toutes les procédures pour obtenir vos documents
          officiels : carte d’identité, passeport, actes, certificats et bien
          plus.
        </p>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <FileText size={28} className="icon" />
          <h3>Documents</h3>
          <p>Toutes les démarches expliquées simplement</p>
        </div>
        <div className="feature">
          <MapPin size={28} className="icon" />
          <h3>Localisation</h3>
          <p>Guidé selon votre région</p>
        </div>
        <div className="feature ">
          <Landmark size={28} className="icon" />
          <h3>Administrations</h3>
          <p>Informations fiables et à jour</p>
        </div>
        <div className="feature">
          <Users size={28} className="icon" />
          <h3>Citoyens</h3>
          <p>Conçu pour tous les sénégalais</p>
        </div>
      </section>

      {/* REGIONS GRID */}
      <section className="regions">
        <h2>Choisissez votre région</h2>
        <div className="grid">
          {regions.map((region) => (
            <Link
              key={region}
              to={`/${region.toLowerCase()}/demarches`}
              className="card"
            >
              <div>
                {" "}
                <MapPin size={24} />
                <h3>{region}</h3>
              </div>
              <p>Voir les démarches</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================= CSS ================= */
