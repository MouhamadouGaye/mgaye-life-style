// backend/src/index.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { photoRoutes } from "./src/routes/photos";
import { userRoutes } from "./src/routes/users";
import { initDatabase } from "./src/db/init";
// import { photoRoutes } from "../routes/photos";
// import { userRoutes } from "../routes/users";
// import { initDatabase } from "../db/init";

const server = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024, // 10MB pour les images
});

async function start() {
  // Plugins
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || "[localhost](http://localhost:3000)",
    credentials: true,
  });

  await server.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
  });

  // Initialiser la base de données
  await initDatabase();

  // Routes
  await server.register(photoRoutes, { prefix: "/api/photos" });
  await server.register(userRoutes, { prefix: "/api/users" });

  // Health check
  server.get("/health", async () => ({ status: "ok" }));

  // Démarrer le serveur
  const port = parseInt(process.env.PORT || "4000", 10);
  await server.listen({ port, host: "0.0.0.0" });
  console.log(`Server running on port ${port}`);
}

start().catch(console.error);
