# Stage de build - Première étape pour construire l'application
# Cette étape permet de compiler et préparer tous les fichiers nécessaires
# On utilise une image Alpine car elle est légère et optimisée
FROM node:18-alpine AS builder

# On définit le répertoire de travail pour toutes les commandes suivantes
# Cela permet d'avoir un contexte cohérent pour l'installation
WORKDIR /app

# On commence par copier uniquement les fichiers de dépendances
# Cette stratégie permet d'optimiser le cache Docker
COPY package*.json ./
# Le dossier prisma contient le schéma de la base de données
# Il est nécessaire pour générer le client Prisma
COPY prisma ./prisma/

# Phase d'installation des dépendances
# npm install télécharge toutes les dépendances listées dans package.json
RUN npm install --no-cache
# La génération du client Prisma est nécessaire pour interagir avec la base de données
# Cela crée les types TypeScript et les méthodes d'accès à la DB
RUN npx prisma generate

# Une fois les dépendances installées, on copie le reste du code source
# Cette étape arrive après pour optimiser le cache Docker
COPY . .

# Construction de l'application Next.js
# Cette étape optimise et compile tout le code pour la production
RUN npm run build

# Début de l'étape de production
# On repart d'une image propre pour minimiser la taille finale
FROM node:18-alpine

# Création du répertoire de travail pour l'application en production
WORKDIR /app

# Configuration de l'environnement de production
ENV NODE_ENV=production

# Copie des fichiers nécessaires depuis l'étape de build
# Les fichiers statiques comme les images sont copiés dans /public
COPY --from=builder /app/public ./public
# L'application compilée est copiée à la racine
COPY --from=builder /app/.next/standalone ./
# Les assets JavaScript et CSS sont copiés dans le dossier .next/static
COPY --from=builder /app/.next/static ./.next/static

# Copier le script de démarrage
COPY start.sh ./
RUN chmod +x start.sh

ENV PORT=8080
EXPOSE 8080
ENV HOSTNAME="0.0.0.0"

# Utiliser le script de démarrage
CMD ["./start.sh"]