FROM node:16-alpine

WORKDIR /app

# Définir les arguments de build
ARG REACT_APP_API_URL
ARG REACT_APP_UPLOADS_URL

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Créer le dossier public s'il n'existe pas
RUN mkdir -p public

# Créer une image placeholder si elle n'existe pas
RUN echo '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#9ca3af" text-anchor="middle">Image non disponible</text></svg>' > public/placeholder.svg

# Construire l'application avec les variables d'environnement
RUN REACT_APP_API_URL=${REACT_APP_API_URL} \
    REACT_APP_UPLOADS_URL=${REACT_APP_UPLOADS_URL} \
    npm run build

# Installer serve pour servir l'application
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Démarrer l'application avec la configuration pour servir les fichiers statiques
CMD ["serve", "-s", "build", "-l", "3000", "--cors"] 