import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Demarches() {
  // const { slug } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const savedRegion = localStorage.getItem("region");

  //   if (savedRegion) {
  //     navigate(`/${savedRegion}/demarches/${slug}`);
  //   }
  // }, []);

  return (
    <div className="center">
      <h2>Choisissez votre région</h2>

      <select
        onChange={(e) => {
          const region = e.target.value;
          localStorage.setItem("region", region);
          navigate(`/${region}/demarches`);
        }}
      >
        <option value="">Sélectionner</option>
        <option value="dakar">Dakar</option>
        <option value="thies">Thiès</option>
        <option value="saint-louis">Saint-Louis</option>
      </select>
    </div>
  );
}
