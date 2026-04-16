import "./AdminPage.css";
import {
  IdCard,
  FileText,
  Home,
  Baby,
  Users,
  Plane,
  Briefcase,
  HeartPulse,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/hero/Hero";

type Demarche = {
  title: string;
  description: string;
  icon: any;
  url: string;
};

export const demarches: Demarche[] = [
  {
    title: "Carte d'identité",
    description: "Faire ou renouveler votre carte nationale",
    icon: IdCard,
    url: "demande-de-cni",
  },
  {
    title: "Acte de naissance",
    description: "Demander un extrait ou copie",
    icon: Baby,
    url: "demande-acte-naissance",
  },
  {
    title: "Passeport",
    description: "Demande ou renouvellement",
    icon: Plane,
    url: "demande-passeport",
  },
  {
    title: "Certificat de résidence",
    description: "Justifier votre domicile",
    icon: Home,
    url: "demande-certificat-residence",
  },
  {
    title: "Casier judiciaire",
    description: "Obtenir votre bulletin n°3",
    icon: FileText,
    url: "demande-casier-judiciaire",
  },
  {
    title: "Mariage",
    description: "Déclaration ou acte de mariage",
    icon: HeartPulse,
    url: "demande-mariage",
  },

  {
    title: "Famille",
    description: "Documents familiaux et livret",
    icon: Users,
    url: "demande-famille",
  },
  {
    title: "Travail",
    description: "Documents administratifs pro",
    icon: Briefcase,
    url: "demande-travail",
  },
];

export default function AdminPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Hero />

      <div className="page">
        <div className="header-admin">
          <h1>📄 Démarches administratives</h1>
          <p>Choisissez une démarche pour commencer</p>
        </div>

        <div className="grid">
          {demarches.map((d, index) => {
            const Icon = d.icon;

            return (
              <div className="card" key={index} onClick={() => navigate(d.url)}>
                <div className="icon">
                  <Icon size={28} />
                </div>

                <h2>{d.title}</h2>
                <p>{d.description}</p>

                <button>Commencer</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
