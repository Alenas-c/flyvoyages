from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from ..models import AdminUser, AgencyInfo, Voyage, VoyageMedia
from .. import db
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from PIL import Image
from slugify import slugify

bp = Blueprint('admin', __name__, url_prefix='/admin')

# Authentication routes
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = AdminUser.query.filter_by(username=data.get('username')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

# Agency info routes
@bp.route('/agency-info', methods=['GET'])
@jwt_required()
def get_agency_info():
    agency_info = AgencyInfo.query.first()
    if not agency_info:
        return jsonify({'error': 'Agency info not found'}), 404
    
    return jsonify({
        'name': agency_info.name,
        'description': agency_info.description,
        'address': agency_info.address,
        'phone': agency_info.phone,
        'email': agency_info.email,
        'website': agency_info.website,
        'facebook': agency_info.facebook,
        'instagram': agency_info.instagram,
        'twitter': agency_info.twitter,
        'opening_hours': agency_info.opening_hours,
        'map_embed': agency_info.map_embed
    })

@bp.route('/agency-info', methods=['PUT'])
@jwt_required()
def update_agency_info():
    data = request.get_json()
    agency_info = AgencyInfo.query.first()
    
    if not agency_info:
        agency_info = AgencyInfo()
        db.session.add(agency_info)
    
    for key, value in data.items():
        if hasattr(agency_info, key):
            setattr(agency_info, key, value)
    
    db.session.commit()
    return jsonify({'message': 'Agency info updated successfully'})

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/voyages', methods=['GET'])
@jwt_required()
def get_voyages():
    try:
        voyages = Voyage.query.order_by(Voyage.created_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [{
                'id': v.id,
                'title': v.title,
                'slug': v.slug,
                'destination': v.destination,
                'pays': v.pays,
                'price': float(v.price),
                'description': v.description,
                'media': [{
                    'id': m.id,
                    'file_path': m.file_path,
                    'media_type': m.media_type,
                    'is_main': m.is_main,
                    'order': m.order
                } for m in v.media],
                'created_at': v.created_at.isoformat() if v.created_at else None,
                'updated_at': v.updated_at.isoformat() if v.updated_at else None
            } for v in voyages]
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages', methods=['POST'])
@jwt_required()
def create_voyage():
    try:
        data = request.form
        files = request.files.getlist('media')

        # Créer le voyage
        voyage = Voyage(
            title=data['title'],
            destination=data['destination'],
            pays=data['pays'],
            price=float(data['price']),
            description=data['description'],
            slug=slugify(data['title'])
        )
        db.session.add(voyage)
        db.session.flush()  # Pour obtenir l'ID du voyage

        # Gérer les médias
        for index, file in enumerate(files):
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"{timestamp}_{filename}"
                
                # Déterminer le type de média
                media_type = 'video' if filename.lower().endswith(('.mp4', '.mov', '.avi')) else 'image'
                
                # Sauvegarder le fichier
                file_path = os.path.join('static', 'uploads', filename)
                file.save(os.path.join(current_app.root_path, '..', file_path))

                # Créer l'entrée dans la base de données
                media = VoyageMedia(
                    voyage_id=voyage.id,
                    file_path=file_path,
                    media_type=media_type,
                    is_main=index == 0,  # Le premier média est l'image principale
                    order=index
                )
                db.session.add(media)

        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': 'Voyage créé avec succès',
            'data': {
                'id': voyage.id,
                'slug': voyage.slug
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages/<int:id>', methods=['PUT'])
@jwt_required()
def update_voyage(id):
    try:
        voyage = Voyage.query.get_or_404(id)
        data = request.form
        files = request.files.getlist('media')

        # Mettre à jour les informations du voyage
        voyage.title = data['title']
        voyage.destination = data['destination']
        voyage.pays = data['pays']
        voyage.price = float(data['price'])
        voyage.description = data['description']
        voyage.slug = slugify(data['title'])

        # Gérer les nouveaux médias
        if files:
            # Supprimer les anciens médias si demandé
            if data.get('delete_existing') == 'true':
                for media in voyage.media:
                    # Supprimer le fichier physique
                    file_path = os.path.join(current_app.root_path, '..', media.file_path)
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    db.session.delete(media)

            # Ajouter les nouveaux médias
            for index, file in enumerate(files):
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f"{timestamp}_{filename}"
                    
                    media_type = 'video' if filename.lower().endswith(('.mp4', '.mov', '.avi')) else 'image'
                    
                    file_path = os.path.join('static', 'uploads', filename)
                    file.save(os.path.join(current_app.root_path, '..', file_path))

                    media = VoyageMedia(
                        voyage_id=voyage.id,
                        file_path=file_path,
                        media_type=media_type,
                        is_main=index == 0,
                        order=index
                    )
                    db.session.add(media)

        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': 'Voyage mis à jour avec succès'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_voyage(id):
    try:
        voyage = Voyage.query.get_or_404(id)
        
        # Supprimer les fichiers physiques
        for media in voyage.media:
            file_path = os.path.join(current_app.root_path, '..', media.file_path)
            if os.path.exists(file_path):
                os.remove(file_path)

        # Supprimer le voyage (les médias seront supprimés automatiquement grâce à CASCADE)
        db.session.delete(voyage)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Voyage supprimé avec succès'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages/<int:id>/media/<int:media_id>', methods=['DELETE'])
@jwt_required()
def delete_media(id, media_id):
    try:
        media = VoyageMedia.query.filter_by(voyage_id=id, id=media_id).first_or_404()
        
        # Supprimer le fichier physique
        file_path = os.path.join(current_app.root_path, '..', media.file_path)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Supprimer l'entrée de la base de données
        db.session.delete(media)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': 'Média supprimé avec succès'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages/<int:id>/media/<int:media_id>/main', methods=['PUT'])
@jwt_required()
def set_main_media(id, media_id):
    try:
        # Désactiver is_main pour tous les médias du voyage
        VoyageMedia.query.filter_by(voyage_id=id).update({'is_main': False})
        
        # Définir le nouveau média principal
        media = VoyageMedia.query.filter_by(voyage_id=id, id=media_id).first_or_404()
        media.is_main = True
        
        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': 'Image principale mise à jour avec succès'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@bp.route('/voyages/<int:id>/media/order', methods=['PUT'])
@jwt_required()
def update_media_order(id):
    try:
        data = request.get_json()
        if not isinstance(data, list):
            raise ValueError("Les données doivent être une liste d'IDs")

        # Mettre à jour l'ordre de chaque média
        for index, media_id in enumerate(data):
            media = VoyageMedia.query.filter_by(voyage_id=id, id=media_id).first_or_404()
            media.order = index

        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': 'Ordre des médias mis à jour avec succès'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500 