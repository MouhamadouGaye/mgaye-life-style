// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { demarches } from "../data/demarches";
import "./admin.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="header">
        <h1>📄 Démarches administratives</h1>
      </div>

      <div className="grid">
        {demarches.map((d) => (
          <div
            className="card"
            key={d.id}
            onClick={() => navigate(`/demarche/${d.id}`)}
          >
            <h2>{d.title}</h2>
            <p>{d.description}</p>
            <button>Commencer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
