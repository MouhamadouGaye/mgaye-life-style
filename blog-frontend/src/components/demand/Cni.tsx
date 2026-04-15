// import { useEffect, useState } from "react";
// import "./Cni.css";

// type Districts = string[];

// interface Commune {
//   name: string;
//   districts?: Districts;
// }

// interface Arrondissement {
//   name: string;
//   communes: Commune[];
// }

// interface Department {
//   name: string;
//   arrondissements: Arrondissement[];
// }

// interface Region {
//   name: string;
//   departments: Department[];
// }

// interface Data {
//   country: string;
//   regions: Region[];
// }

// const API_URL = "http://localhost:3000";

// export default function Cni() {
//   const [data, setData] = useState<Data | null>(null);

//   const [regions, setRegions] = useState<Region[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [arrondissements, setArrondissements] = useState<Arrondissement[]>([]);
//   const [communes, setCommunes] = useState<Commune[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);

//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [selectedDept, setSelectedDept] = useState("");
//   const [selectedArr, setSelectedArr] = useState("");
//   const [selectedCommune, setSelectedCommune] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");

//   // Load all regions
//   useEffect(() => {
//     fetch(`${API_URL}/regions`)
//       .then((res) => res.json())
//       .then((res) => setRegions(res));
//   }, []);

//   // When region changes -> load departments
//   useEffect(() => {
//     if (!selectedRegion) return;

//     fetch(`${API_URL}/regions/${selectedRegion}/departments`)
//       .then((res) => res.json())
//       .then((res) => {
//         setDepartments(res);
//         setArrondissements([]);
//         setCommunes([]);
//         console.log(res);
//       });
//   }, [selectedRegion]);

//   // When department changes -> load arrondissements
//   useEffect(() => {
//     if (!selectedDept) return;

//     fetch(`${API_URL}/departments/${selectedDept}/arrondissements`)
//       .then((res) => res.json())
//       .then((res) => {
//         setArrondissements(res);
//         setCommunes([]);
//       });
//   }, [selectedDept]);

//   // When arrondissement changes -> load communes
//   useEffect(() => {
//     if (!selectedArr) return;

//     fetch(`${API_URL}/arrondissements/${selectedArr}/communes`)
//       .then((res) => res.json())
//       .then((res) => setCommunes(res));
//   }, [selectedArr]);

//   // When commune changes -> load districts
//   useEffect(() => {
//     if (!selectedCommune) return;

//     fetch(`${API_URL}/communes/${selectedCommune}/districts`)
//       .then((res) => res.json())
//       .then((res) => setDistricts(res));
//   }, [selectedCommune]);

//   return (
//     <div className="container">
//       <div className="card">
//         <h1>🪪 Demande de Carte d’Identité</h1>
//         <p className="subtitle">Remplissez votre localisation administrative</p>

//         {/* Region */}
//         <label>Région</label>
//         <select
//           value={selectedRegion}
//           onChange={(e) => setSelectedRegion(e.target.value)}
//         >
//           <option value="">Choisir une région</option>
//           {regions.map((r) => (
//             <option key={r.name} value={r.name}>
//               {r.name}
//             </option>
//           ))}
//         </select>

//         {/* Department */}
//         <label>Département</label>
//         <select
//           value={selectedDept}
//           onChange={(e) => setSelectedDept(e.target.value)}
//         >
//           <option value="">Choisir un département</option>
//           {regions
//             ? regions
//                 .find((r) => r.name === selectedRegion)
//                 ?.departments.map((d) => (
//                   <option key={d.name} value={d.name}>
//                     {d.name}
//                   </option>
//                 )) || []
//             : "Chosisir une région d'abord"}
//         </select>

//         {/* Arrondissement */}
//         <label>Arrondissement</label>
//         <select
//           value={selectedArr}
//           onChange={(e) => setSelectedArr(e.target.value)}
//         >
//           <option value=""> Choisir un arrondissement </option>
//           {arrondissements.map((a) => (
//             <option key={a.name} value={a.name}>
//               {a.name}
//             </option>
//           ))}
//         </select>

//         {/* Commune */}
//         <label>Commune</label>
//         <select
//           value={selectedCommune}
//           onChange={(e) => setSelectedCommune(e.target.value)}
//         >
//           <option value="">Choisir une commune </option>
//           {communes.map((c) => (
//             <option key={c.name} value={c.name}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         {/* District */}
//         <label>Quartier / District</label>
//         <select
//           value={selectedDistrict}
//           onChange={(e) => setSelectedDistrict(e.target.value)}
//         >
//           <option value="">Choisir un quartier </option>
//           {districts.map((d) => (
//             <option key={d} value={d}>
//               {d}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={() => {
//             alert(
//               `Demande enregistrée:\n${selectedRegion} > ${selectedDept} > ${selectedArr} > ${selectedCommune} > ${selectedDistrict}`,
//             );
//           }}
//         >
//           Valider la demande
//         </button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import "./Cni.css";
import { Navigate, useParams } from "react-router-dom";
import { demarches } from "../../pages/AdminPage";

type Districts = string[];

interface Commune {
  name: string;
  districts?: Districts;
}

interface Arrondissement {
  name: string;
}

interface Department {
  name: string;
}

interface Region {
  name: string;
}

const API_URL = "http://localhost:3000";

export default function Cni() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [arrondissements, setArrondissements] = useState<Arrondissement[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedArr, setSelectedArr] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [loading, setLoading] = useState(false);
  const { region, expleDemandeDeCni } = useParams();

  // 🔹 helper fetch propre
  const fetchData = async (url: string, setter: Function) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load regions
  useEffect(() => {
    fetchData(`${API_URL}/regions`, setRegions);
  }, []);

  // Region → departments
  useEffect(() => {
    if (!selectedRegion) return;

    setSelectedDept("");
    setSelectedArr("");
    setSelectedCommune("");
    setSelectedDistrict("");

    setArrondissements([]);
    setCommunes([]);
    setDistricts([]);

    fetchData(
      `${API_URL}/regions/${selectedRegion}/departments`,
      setDepartments,
    );
  }, [selectedRegion]);

  // Department → arrondissements
  useEffect(() => {
    if (!selectedDept) return;

    setSelectedArr("");
    setSelectedCommune("");
    setSelectedDistrict("");

    setCommunes([]);
    setDistricts([]);

    fetchData(
      `${API_URL}/departments/${selectedDept}/arrondissements`,
      setArrondissements,
    );
  }, [selectedDept]);

  // Arr → communes
  useEffect(() => {
    if (!selectedArr) return;

    setSelectedCommune("");
    setSelectedDistrict("");

    setDistricts([]);

    fetchData(
      `${API_URL}/arrondissements/${selectedArr}/communes`,
      setCommunes,
    );
  }, [selectedArr]);

  // Commune → districts
  useEffect(() => {
    if (!selectedCommune) return;

    setSelectedDistrict("");

    fetchData(`${API_URL}/communes/${selectedCommune}/districts`, setDistricts);
  }, [selectedCommune]);

  // return (
  //   <div className="container">
  //     <div className="card">
  //       <h1>🪪 Demande de Carte d’Identité</h1>
  //       <p className="subtitle">
  //         {loading ? "Chargement..." : "Remplissez votre localisation"}
  //       </p>

  //       {/* REGION */}
  //       <select
  //         value={selectedRegion}
  //         onChange={(e) => setSelectedRegion(e.target.value)}
  //       >
  //         <option value="">Région</option>
  //         {regions.map((r) => (
  //           <option key={r.name}>{r.name}</option>
  //         ))}
  //       </select>

  //       {/* DEPARTMENT */}
  //       <select
  //         value={selectedDept}
  //         disabled={!selectedRegion}
  //         onChange={(e) => setSelectedDept(e.target.value)}
  //       >
  //         <option value="">Département</option>
  //         {departments.map((d) => (
  //           <option key={d.name}>{d.name}</option>
  //         ))}
  //       </select>

  //       {/* ARRONDISSEMENT */}
  //       <select
  //         value={selectedArr}
  //         disabled={!selectedDept}
  //         onChange={(e) => setSelectedArr(e.target.value)}
  //       >
  //         <option value="">Arrondissement</option>
  //         {arrondissements.map((a) => (
  //           <option key={a.name}>{a.name}</option>
  //         ))}
  //       </select>

  //       {/* COMMUNE */}
  //       <select
  //         value={selectedCommune}
  //         disabled={!selectedArr}
  //         onChange={(e) => setSelectedCommune(e.target.value)}
  //       >
  //         <option value="">Commune</option>
  //         {communes.map((c) => (
  //           <option key={c.name}>{c.name}</option>
  //         ))}
  //       </select>

  //       {/* DISTRICT */}
  //       <select
  //         value={selectedDistrict}
  //         disabled={!selectedCommune}
  //         onChange={(e) => setSelectedDistrict(e.target.value)}
  //       >
  //         <option value="">Quartier</option>
  //         {districts.map((d) => (
  //           <option key={d}>{d}</option>
  //         ))}
  //       </select>

  //       <button
  //         disabled={!selectedDistrict}
  //         onClick={() => {
  //           alert(
  //             `${selectedRegion} > ${selectedDept} > ${selectedArr} > ${selectedCommune} > ${selectedDistrict}`,
  //           );
  //         }}
  //       >
  //         Valider
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="container">
      <div className="card-pour-cni">
        <h1>
          🪪 Demande de{" "}
          {`${demarches.find((d) => d.url === expleDemandeDeCni)?.title || expleDemandeDeCni}`}
        </h1>
        <h4>
          à {`${region && region.charAt(0).toUpperCase() + region.slice(1)}`}
        </h4>
        <p className="subtitle">
          {loading ? "Chargement..." : "Remplissez votre localisation"}
        </p>

        <div className="grid">
          <div className="field">
            <label>Région</label>
            <select
              value={selectedRegion}
              onChange={(e) =>
                setSelectedRegion(
                  region ? region.toUpperCase() : e.target.value,
                )
              }
            >
              <option value="">Choisir</option>
              {regions.map((r) => (
                <option key={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Département</label>
            <select
              value={selectedDept}
              disabled={!selectedRegion}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">Choisir</option>
              {departments.map((d) => (
                <option key={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Arrondissement</label>
            <select
              value={selectedArr}
              disabled={!selectedDept}
              onChange={(e) => setSelectedArr(e.target.value)}
            >
              <option value="">Choisir</option>
              {arrondissements.map((a) => (
                <option key={a.name}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Commune</label>
            <select
              value={selectedCommune}
              disabled={!selectedArr}
              onChange={(e) => setSelectedCommune(e.target.value)}
            >
              <option value="">Choisir</option>
              {communes.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="field full">
            <label>Quartier</label>
            <select
              value={selectedDistrict}
              disabled={!selectedCommune}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">Choisir</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <button disabled={!selectedDistrict}>Valider</button>
      </div>
    </div>
  );
}
