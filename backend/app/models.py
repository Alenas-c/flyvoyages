from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class AgencyInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    address = db.Column(db.String(200))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    website = db.Column(db.String(200))
    facebook = db.Column(db.String(200))
    instagram = db.Column(db.String(200))
    twitter = db.Column(db.String(200))
    opening_hours = db.Column(db.Text)
    map_embed = db.Column(db.Text)  # Google Maps iframe code
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VoyageMedia(db.Model):
    __tablename__ = 'voyage_media'
    
    id = db.Column(db.Integer, primary_key=True)
    voyage_id = db.Column(db.Integer, db.ForeignKey('voyage.id', ondelete='CASCADE'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    media_type = db.Column(db.String(10), nullable=False)  # 'image' ou 'video'
    is_main = db.Column(db.Boolean, default=False)  # Pour l'image principale
    order = db.Column(db.Integer, default=0)  # Pour ordonner les médias
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    voyage = db.relationship('Voyage', backref=db.backref('media', lazy=True, cascade='all, delete-orphan'))

class Voyage(db.Model):
    __tablename__ = 'voyage'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    pays = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def get_main_image(self):
        """Retourne l'image principale du voyage"""
        main_media = VoyageMedia.query.filter_by(
            voyage_id=self.id,
            is_main=True,
            media_type='image'
        ).first()
        return main_media.file_path if main_media else None

    def get_all_media(self):
        """Retourne tous les médias du voyage ordonnés"""
        return VoyageMedia.query.filter_by(
            voyage_id=self.id
        ).order_by(VoyageMedia.order).all()

    def __init__(self, *args, **kwargs):
        super(Voyage, self).__init__(*args, **kwargs)
        if not self.slug:
            self.slug = self._generate_slug()

    def _generate_slug(self):
        from slugify import slugify
        return slugify(self.title) 