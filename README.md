# FlyVoyages - Agence de Voyage

Site vitrine d'une agence de voyage avec interface d'administration.

## Technologies utilisées

- Frontend: React, Tailwind CSS
- Backend: Python Flask
- Base de données: SQLite (développement) / PostgreSQL (production)

## Prérequis

- Node.js (v18 ou supérieur)
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

## Installation

### Backend

1. Créer un environnement virtuel Python :
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Installer les dépendances Python :
```bash
pip install -r requirements.txt
```

3. Initialiser la base de données :
```bash
flask db init
flask db migrate
flask db upgrade
```

4. Lancer le serveur backend :
```bash
flask run
```

### Frontend

1. Installer les dépendances Node.js :
```bash
cd frontend
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

## Structure du projet

```
flyvoyages/
├── backend/           # API Flask
│   ├── app/
│   ├── migrations/    # Migrations de base de données
│   └── requirements.txt
├── frontend/         # Application React
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Fonctionnalités

- Site vitrine avec présentation de l'agence
- Catalogue de voyages et séjours
- Interface d'administration sécurisée
- Gestion des voyages (CRUD)
- Gestion des informations de l'agence
- Upload d'images
- Intégration Google Maps

## Sécurité

- Authentification JWT pour l'interface admin
- Validation des uploads d'images
- Protection CSRF
- Hachage des mots de passe 