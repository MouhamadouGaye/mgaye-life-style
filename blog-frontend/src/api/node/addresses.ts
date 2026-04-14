// API Node.js (Express) en TypeScript pour la cartographie du Sénégal

import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Types
interface Commune {
  name: string;
  districts?: string[];
}

interface Arrondissement {
  name: string;
  communes: Commune[];
}

interface Department {
  name: string;
  arrondissements: Arrondissement[];
}

interface Region {
  name: string;
  departments: Department[];
}

interface Data {
  country: string;
  regions: Region[];
}

// Charger les données
const dataPath = path.join(__dirname, "senegal-data.json");
const data: Data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Root
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API Sénégal cartographie OK (TypeScript)" });
});

// Toutes les régions
app.get("/regions", (req: Request, res: Response) => {
  res.json(data.regions);
});

// Une région
app.get("/regions/:name", (req: Request, res: Response) => {
  const region = data.regions.find(
    (r) => r.name.toLowerCase() === req.params.name.toLowerCase(),
  );
  if (!region) res.status(404).json({ error: "Region not found" });
  res.json(region);
});

// Départements d'une région
app.get("/regions/:name/departments", (req: Request, res: Response) => {
  const region = data.regions.find(
    (r) => r.name.toLowerCase() === req.params.name.toLowerCase(),
  );
  if (!region) {
    res.status(404).json({ error: "Region not found" });
    return;
  }
  res.json(region.departments);
});

// // Arrondissements d’un département
// app.get("/departments/:name/arrondissements", (req: Request, res: Response) => {
//   for (const region of data.regions) {
//     const dept = region.departments.find(
//       (d) => d.name.toLowerCase() === req.params.name.toLowerCase(),
//     );
//     if (dept) res.json(dept.arrondissements);
//   }
//   res.status(404).json({ error: "Department not found" });
// });
app.get("/departments/:name/arrondissements", (req: Request, res: Response) => {
  const dept = data.regions
    .flatMap((r) => r.departments)
    .find((d) => d.name.toLowerCase() === req.params.name.toLowerCase());

  if (!dept) {
    res.status(404).json({ error: "Department not found" });
    return;
  }

  res.json(dept.arrondissements);
});

// Communes d’un arrondissement
app.get("/arrondissements/:name/communes", (req: Request, res: Response) => {
  for (const region of data.regions) {
    for (const dept of region.departments) {
      const arr = dept.arrondissements.find(
        (a) => a.name.toLowerCase() === req.params.name.toLowerCase(),
      );
      if (arr) {
        res.json(arr.communes);
        return;
      }
    }
  }
  res.status(404).json({ error: "Arrondissement not found" });
});

app.get("/communes/:name/districts", (req: Request, res: Response): void => {
  for (const region of data.regions) {
    for (const dept of region.departments) {
      for (const arr of dept.arrondissements) {
        const commune = arr.communes.find(
          (c) => c.name.toLowerCase() === req.params.name.toLowerCase(),
        );
        if (commune) {
          res.json(commune.districts || []);
          return;
        }
      }
    }
  }
  res.status(404).json({ error: "Commune not found" });
});

// Recherche globale
app.get("/search", (req: Request, res: Response) => {
  const q = (req.query.q as string)?.toLowerCase();
  if (!q) {
    res.json([]);
    return;
  }

  let results: any[] = [];

  for (const region of data.regions) {
    if (region.name.toLowerCase().includes(q)) results.push(region);

    for (const dept of region.departments) {
      if (dept.name.toLowerCase().includes(q)) results.push(dept);

      for (const arr of dept.arrondissements) {
        if (arr.name.toLowerCase().includes(q)) results.push(arr);

        for (const com of arr.communes) {
          if (com.name.toLowerCase().includes(q)) results.push(com);

          if (com.districts) {
            const matches = com.districts.filter((d) =>
              d.toLowerCase().includes(q),
            );
            results.push(...matches);
          }
        }
      }
    }
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});

// Pour exécuter :
// 1. npm install express @types/express typescript ts-node
// 2. npx tsc --init
// 3. npx ts-node index.ts
