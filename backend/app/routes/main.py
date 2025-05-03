from flask import Blueprint, jsonify, request
from flask_cors import CORS
from ..models import AgencyInfo, Voyage, VoyageMedia
from .. import db
from sqlalchemy import distinct, func
import random

bp = Blueprint('main', __name__)
CORS(bp)  # Activer CORS pour ce blueprint

@bp.route('/')
def index():
    try:
        agency_info = AgencyInfo.query.first()
        voyages = Voyage.query.order_by(Voyage.created_at.desc()).limit(6).all()
        
        return jsonify({
            'status': 'success',
            'agency': {
                'name': agency_info.name if agency_info else None,
                'description': agency_info.description if agency_info else None,
                'address': agency_info.address if agency_info else None,
                'phone': agency_info.phone if agency_info else None,
                'email': agency_info.email if agency_info else None,
                'website': agency_info.website if agency_info else None,
                'social_media': {
                    'facebook': agency_info.facebook if agency_info else None,
                    'instagram': agency_info.instagram if agency_info else None,
                    'twitter': agency_info.twitter if agency_info else None
                },
                'opening_hours': agency_info.opening_hours if agency_info else None,
                'map_embed': agency_info.map_embed if agency_info else None
            },
            'featured_voyages': [{
                'id': voyage.id,
                'title': voyage.title,
                'destination': voyage.destination,
                'pays': voyage.pays,
                'price': voyage.price,
                'description': voyage.description,
                'slug': voyage.slug,
                'media': [{
                    'id': media.id,
                    'file_path': media.file_path,
                    'media_type': media.media_type,
                    'is_main': media.is_main,
                    'order': media.order
                } for media in voyage.media]
            } for voyage in voyages]
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/destinations')
def destinations():
    try:
        # Récupérer les statistiques par pays
        pays_stats = db.session.query(
            Voyage.pays,
            func.count(Voyage.id).label('voyage_count'),
            func.min(Voyage.price).label('min_price'),
            func.max(Voyage.price).label('max_price')
        ).group_by(
            Voyage.pays
        ).all()

        # Pour chaque pays, récupérer une image aléatoire
        destinations = []
        for pays_stat in pays_stats:
            # Récupérer une image aléatoire pour ce pays
            random_voyage = Voyage.query.filter_by(pays=pays_stat[0]).order_by(func.random()).first()
            
            # Construire la description
            description = f"Découvrez nos voyages vers {pays_stat[0]}"
            if pays_stat[2] is not None:
                description += f". Prix à partir de {float(pays_stat[2]):,.0f} DA"
            
            # Récupérer les médias du voyage aléatoire
            media = []
            if random_voyage:
                media = [{
                    'id': m.id,
                    'file_path': m.file_path,
                    'media_type': m.media_type,
                    'is_main': m.is_main,
                    'order': m.order
                } for m in random_voyage.media]
            
            destination = {
                'pays': pays_stat[0],
                'voyage_count': pays_stat[1],
                'price_range': {
                    'min': float(pays_stat[2]) if pays_stat[2] is not None else None,
                    'max': float(pays_stat[3]) if pays_stat[3] is not None else None
                },
                'media': media,
                'description': description
            }
            destinations.append(destination)

        return jsonify({
            'status': 'success',
            'data': destinations,
            'count': len(destinations)
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages')
def voyages():
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

@bp.route('/voyages/<slug>')
def voyage_detail(slug):
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

