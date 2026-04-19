// backend/src/db/init.ts
import { pool } from "./pool";

export async function initDatabase() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS identity_photos (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        national_id VARCHAR(50) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        metadata JSONB DEFAULT '{}',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        CONSTRAINT unique_national_id UNIQUE (national_id)
      );

      CREATE INDEX IF NOT EXISTS idx_photos_email ON identity_photos(email);
      CREATE INDEX IF NOT EXISTS idx_photos_national_id ON identity_photos(national_id);
      CREATE INDEX IF NOT EXISTS idx_photos_created_at ON identity_photos(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_photos_metadata ON identity_photos USING GIN(metadata);

      -- Fonction pour mettre à jour updated_at automatiquement
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Trigger pour updated_at
      DROP TRIGGER IF EXISTS update_identity_photos_updated_at ON identity_photos;
      CREATE TRIGGER update_identity_photos_updated_at
        BEFORE UPDATE ON identity_photos
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("Database initialized successfully");
  } finally {
    client.release();
  }
}
