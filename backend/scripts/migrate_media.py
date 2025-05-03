from app import create_app, db
from app.models import Voyage, VoyageMedia
from sqlalchemy import text

def migrate_media():
    app = create_app()
    with app.app_context():
        try:
            # Créer la table voyage_media
            db.session.execute(text("""
                CREATE TABLE IF NOT EXISTS voyage_media (
                    id SERIAL PRIMARY KEY,
                    voyage_id INTEGER NOT NULL REFERENCES voyage(id) ON DELETE CASCADE,
                    file_path VARCHAR(255) NOT NULL,
                    media_type VARCHAR(10) NOT NULL,
                    is_main BOOLEAN DEFAULT FALSE,
                    "order" INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT check_media_type CHECK (media_type IN ('image', 'video'))
                );
            """))
            db.session.commit()
            print("✅ Table voyage_media créée avec succès")

            # Migrer les images existantes
            db.session.execute(text("""
                INSERT INTO voyage_media (voyage_id, file_path, media_type, is_main, "order")
                SELECT id, image_path, 'image', TRUE, 0
                FROM voyage
                WHERE image_path IS NOT NULL;
            """))
            db.session.commit()
            print("✅ Images migrées avec succès")

            # Supprimer la colonne image_path
            db.session.execute(text("""
                ALTER TABLE voyage DROP COLUMN IF EXISTS image_path;
            """))
            db.session.commit()
            print("✅ Colonne image_path supprimée avec succès")

            print("✅ Migration terminée avec succès")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Erreur lors de la migration: {str(e)}")
            raise

if __name__ == '__main__':
    migrate_media() 