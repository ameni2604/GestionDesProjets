
# API REST - Gestion de Projets et Taches

## Description
Mini-projet DS1 - ISIDS.
API REST developpee avec Express.js et MongoDB
pour la gestion des projets et des taches.

## Auteurs
- Ameni Abidi

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Installation

```bash
npm install
```

## Configuration

Creer un fichier `.env` a partir de `.env.example`.

Configurer les variables :
- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN

## Demarrage

```bash
npm run dev
```



### Authentification

- `POST /api/auth/register` : envoyer `nom`, `login`, `password` et `role` (`user` ou `manager`).
- `POST /api/auth/login` : envoyer `login` et `password`; la reponse contient le token JWT.

### Projets

- `POST /api/projects` : creer un projet avec `nom` (requis), `description` et `statut` (`en_cours`, `termine` ou `en_pause`). Le proprietaire est automatiquement l'utilisateur connecte.
- `GET /api/projects` : l'utilisateur voit ses projets; le manager voit tous les projets.
- `GET /api/projects/:id` : consulter un projet accessible.
- `PATCH /api/projects/:id` : modifier `nom`, `description` ou `statut`.
- `DELETE /api/projects/:id` : supprimer un projet accessible.

La liste accepte les filtres `search` (nom ou description) et `statut`, ainsi que le tri `sort` (`nom`, `statut` ou `createdAt`) et `order` (`asc` ou `desc`). Les champs `createdAt` et `updatedAt` sont ajoutes automatiquement.
