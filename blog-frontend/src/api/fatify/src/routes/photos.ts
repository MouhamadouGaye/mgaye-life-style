// backend/src/routes/photos.ts
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { pool } from "../db/pool";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-west-1",
  endpoint: process.env.S3_ENDPOINT, // Pour MinIO local
  forcePathStyle: true,
});

interface PhotoUploadBody {
  imageData: string; // Base64
  email: string;
  nationalId: string;
  metadata: {
    brightness: number;
    symmetryScore: number;
    faceSize: number;
    timestamp: string;
  };
}

export async function photoRoutes(server: FastifyInstance) {
  // Upload d'une nouvelle photo d'identité
  server.post(
    "/upload",
    async (
      request: FastifyRequest<{ Body: PhotoUploadBody }>,
      reply: FastifyReply,
    ) => {
      const { imageData, email, nationalId, metadata } = request.body;

      // Validation
      if (!imageData || !email || !nationalId) {
        return reply.status(400).send({ error: "Données manquantes" });
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reply.status(400).send({ error: "Email invalide" });
      }

      try {
        // Décoder l'image base64
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");

        // Traitement de l'image avec Sharp
        const processedImage = await sharp(imageBuffer)
          .resize(600, 800, { fit: "cover", position: "centre" })
          .jpeg({ quality: 90, chromaSubsampling: "4:4:4" }) // Meilleure qualité pour les détails
          .toBuffer();

        // Générer un identifiant unique pour la photo
        const photoId = randomUUID();
        const fileName = `photos/${photoId}.jpg`;

        // Upload vers S3/MinIO
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET || "identity-photos",
            Key: fileName,
            Body: processedImage,
            ContentType: "image/jpeg",
            Metadata: {
              email,
              nationalId,
              uploadDate: new Date().toISOString(),
            },
          }),
        );

        // Enregistrer en base de données
        const result = await pool.query(
          `INSERT INTO identity_photos 
         (id, email, national_id, file_path, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING id, email, national_id, created_at`,
          [photoId, email, nationalId, fileName, JSON.stringify(metadata)],
        );

        const photo = result.rows[0];

        return reply.status(201).send({
          success: true,
          photo: {
            id: photo.id,
            email: photo.email,
            nationalId: photo.national_id,
            createdAt: photo.created_at,
          },
        });
      } catch (error) {
        server.log.error(error);
        return reply
          .status(500)
          .send({ error: "Erreur lors du traitement de la photo" });
      }
    },
  );

  // Récupérer une photo par ID
  server.get(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;

      try {
        const result = await pool.query(
          `SELECT id, email, national_id, file_path, metadata, created_at, updated_at
         FROM identity_photos
         WHERE id = $1`,
          [id],
        );

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: "Photo non trouvée" });
        }

        const photo = result.rows[0];

        return reply.send({
          id: photo.id,
          email: photo.email,
          nationalId: photo.national_id,
          metadata: photo.metadata,
          createdAt: photo.created_at,
          updatedAt: photo.updated_at,
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Erreur serveur" });
      }
    },
  );

  // Rechercher par email ou numéro d'identité
  server.get(
    "/search",
    async (
      request: FastifyRequest<{
        Querystring: { email?: string; nationalId?: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { email, nationalId } = request.query;

      if (!email && !nationalId) {
        return reply
          .status(400)
          .send({ error: "Email ou numéro d'identité requis" });
      }

      try {
        let query =
          "SELECT id, email, national_id, created_at FROM identity_photos WHERE ";
        const params: string[] = [];

        if (email) {
          params.push(email);
          query += `email = $${params.length}`;
        }

        if (nationalId) {
          if (params.length > 0) query += " OR ";
          params.push(nationalId);
          query += `national_id = $${params.length}`;
        }

        query += " ORDER BY created_at DESC LIMIT 10";

        const result = await pool.query(query, params);

        return reply.send({
          photos: result.rows.map((row) => ({
            id: row.id,
            email: row.email,
            nationalId: row.national_id,
            createdAt: row.created_at,
          })),
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ error: "Erreur serveur" });
      }
    },
  );
}
