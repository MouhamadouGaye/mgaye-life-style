import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "crypto";
import { pool } from "../db/pool";

interface CreateUserBody {
  email: string;
  nationalId: string;
}

interface UpdateUserBody {
  email?: string;
  nationalId?: string;
}

export async function userRoutes(server: FastifyInstance) {
  // Créer un nouvel utilisateur
  server.post(
    "/",
    async (
      request: FastifyRequest<{ Body: CreateUserBody }>,
      reply: FastifyReply,
    ) => {
      const { email, nationalId } = request.body;

      if (!email || !nationalId) {
        return reply.status(400).send({ error: "Données manquantes" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return reply.status(400).send({ error: "Email invalide" });
      }

      try {
        // Vérifier si l'utilisateur existe déjà
        const existing = await pool.query(
          `SELECT id FROM users WHERE email = $1 OR national_id = $2`,
          [email, nationalId],
        );

        if (existing.rows.length > 0) {
          return reply
            .status(409)
            .send({ error: "Email ou numéro d'identité déjà utilisé" });
        }

        const userId = randomUUID();

        const result = await pool.query(
          `INSERT INTO users (id, email, national_id, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING id, email, national_id, created_at`,
          [userId, email, nationalId],
        );

        const user = result.rows[0];

        return reply.status(201).send({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            nationalId: user.national_id,
            createdAt: user.created_at,
          },
        });
      } catch (error) {
        server.log.error(error);
        return reply
          .status(500)
          .send({ error: "Erreur lors de la création de l'utilisateur" });
      }
    },
  );

  // Récupérer un utilisateur par ID
  server.get(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;

      try {
        const result = await pool.query(
          `SELECT id, email, national_id, created_at, updated_at
           FROM users
           WHERE id = $1`,
          [id],
        );

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: "Utilisateur non trouvé" });
        }

        const user = result.rows[0];

        return reply.send({
          id: user.id,
          email: user.email,
          nationalId: user.national_id,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
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
          "SELECT id, email, national_id, created_at FROM users WHERE ";
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
          users: result.rows.map((row) => ({
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

  // Mettre à jour un utilisateur
  server.patch(
    "/:id",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: UpdateUserBody;
      }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { email, nationalId } = request.body;

      if (!email && !nationalId) {
        return reply
          .status(400)
          .send({ error: "Aucune donnée à mettre à jour" });
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return reply.status(400).send({ error: "Email invalide" });
        }
      }

      try {
        const fields: string[] = [];
        const params: string[] = [];

        if (email) {
          params.push(email);
          fields.push(`email = $${params.length}`);
        }

        if (nationalId) {
          params.push(nationalId);
          fields.push(`national_id = $${params.length}`);
        }

        params.push(id);

        const result = await pool.query(
          `UPDATE users
           SET ${fields.join(", ")}, updated_at = NOW()
           WHERE id = $${params.length}
           RETURNING id, email, national_id, created_at, updated_at`,
          params,
        );

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: "Utilisateur non trouvé" });
        }

        const user = result.rows[0];

        return reply.send({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            nationalId: user.national_id,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          },
        });
      } catch (error) {
        server.log.error(error);
        return reply
          .status(500)
          .send({ error: "Erreur lors de la mise à jour de l'utilisateur" });
      }
    },
  );

  // Supprimer un utilisateur
  server.delete(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;

      try {
        const result = await pool.query(
          `DELETE FROM users WHERE id = $1 RETURNING id`,
          [id],
        );

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: "Utilisateur non trouvé" });
        }

        return reply.send({ success: true, id });
      } catch (error) {
        server.log.error(error);
        return reply
          .status(500)
          .send({ error: "Erreur lors de la suppression de l'utilisateur" });
      }
    },
  );
}
