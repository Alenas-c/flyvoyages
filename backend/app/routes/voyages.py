from flask import Blueprint, jsonify, request
from ..models import Voyage
from .. import db
from datetime import datetime

bp = Blueprint('voyages', __name__)

@bp.route('/')
def list_voyages():
    try:
        # Récupérer tous les voyages triés par date de création
        voyages = Voyage.query.order_by(Voyage.created_at.desc()).all()

        # Formater la réponse
        voyages_data = [{
            'id': voyage.id,
            'title': voyage.title,
            'destination': voyage.destination,
            'pays': voyage.pays,
            'price': float(voyage.price),
            'description': voyage.description,
            'slug': voyage.slug,
            'created_at': voyage.created_at.isoformat() if voyage.created_at else None,
            'media': [{
                'id': media.id,
                'file_path': media.file_path,
                'media_type': media.media_type,
                'is_main': media.is_main,
                'order': media.order
            } for media in voyage.media]
        } for voyage in voyages]

        return jsonify({
            'status': 'success',
            'data': voyages_data,
            'count': len(voyages_data)
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
@bp.route('/<slug>')
def get_voyage(slug):
    try:
        voyage = Voyage.query.filter_by(slug=slug).first()
        if not voyage:
            return jsonify({
                'status': 'error',
                'message': 'Voyage non trouvé'
            }), 404

        # Récupérer tous les médias du voyage
        media_data = [{
            'id': media.id,
            'file_path': media.file_path,
            'media_type': media.media_type,
            'is_main': media.is_main,
            'order': media.order
        } for media in voyage.media]

        return jsonify({
            'status': 'success',
            'data': {
                'id': voyage.id,
                'title': voyage.title,
                'destination': voyage.destination,
                'pays': voyage.pays,
                'price': float(voyage.price),
                'description': voyage.description,
                'slug': voyage.slug,
                'created_at': voyage.created_at.isoformat() if voyage.created_at else None,
                'media': media_data
            }
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500