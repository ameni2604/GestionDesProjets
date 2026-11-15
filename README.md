# API REST — Gestion de projets et de tâches

API REST développée avec Node.js, Express et MongoDB/Mongoose. Elle permet de gérer les comptes, les projets et leurs tâches, avec authentification JWT, contrôle d'accès par rôle, recherche, filtres et tri.

## Sommaire

- [Technologies et structure](#technologies-et-structure)
- [Installation et configuration](#installation-et-configuration)
- [Authentification et autorisations](#authentification-et-autorisations)
- [API des utilisateurs](#1-authentification)
- [API des projets](#2-gestion-des-projets)
- [API des tâches](#3-gestion-des-tâches)
- [Validation et erreurs](#validation-et-erreurs)

## Technologies et structure

- Node.js et Express.js
- MongoDB et Mongoose
- JSON Web Token (`jsonwebtoken`) et hachage des mots de passe (`bcryptjs`)
- `express-validator` pour valider les corps et paramètres de requête

Le code est organisé dans `src/` : `routes/`, `controllers/`, `services/`, `repositories/`, `models/`, `middlewares/` et `validators/`. L'application Express est définie dans `src/app.js` et démarrée par `src/server.js`.

## Installation et configuration

Prérequis : Node.js, npm et une instance MongoDB accessible.

```powershell
npm install
Copy-Item .env.example .env
```

Configure `.env`, puis démarre l'API :

```powershell
npm run dev
```

Pour un démarrage sans redémarrage automatique :

```powershell
npm start
```

| Variable | Description |
| --- | --- |
| `PORT` | Port HTTP (défaut : `5000`) |
| `MONGO_URI` | URI de connexion MongoDB |
| `JWT_SECRET` | Secret privé de signature des jetons JWT |
| `JWT_EXPIRES_IN` | Durée de validité du jeton (défaut : `1d`) |

Génère une valeur privée et suffisamment forte pour `JWT_SECRET`. Ne partage pas et ne committe pas `.env`. L'API est disponible par défaut à `http://localhost:5000`.

## Authentification et autorisations

Les routes de projets et de tâches nécessitent un jeton obtenu par connexion. Le transmettre dans l'en-tête HTTP :

```http
Authorization: Bearer <token>
```

Les mots de passe sont hachés lors de l'inscription. Le jeton contient l'identifiant et le rôle de l'utilisateur et expire selon `JWT_EXPIRES_IN`.

- `user` : consulte et modifie ses propres projets et les tâches de ses projets.
- `manager` : consulte et gère les projets et tâches de tous les utilisateurs.
- La création de tâche est accessible à tout utilisateur connecté et accepte l'identifiant de tout projet existant. Toutefois, l'accès ultérieur à la tâche reste limité au propriétaire du projet et aux managers.
- L'affectation d'une tâche (`/assign`) est réservée au rôle `manager`.


## 1. Authentification

| Méthode | Endpoint | Description | Authentification |
| --- | --- | --- | --- |
| `GET` | `/` | Vérifier que l'API répond | Non |
| `POST` | `/api/auth/register` | Créer un compte | Non |
| `POST` | `/api/auth/login` | Se connecter et obtenir un JWT | Non |

### Inscription

Corps JSON requis : `nom`, `login`, `password` et `role` (`user` ou `manager`). La réponse renvoie l'utilisateur créé sans son mot de passe. Un login déjà utilisé est refusé.

### Connexion

Corps JSON requis : `login` et `password`. La réponse contient `token` et les informations de l'utilisateur (`id`, `nom`, `login`, `role`).

## 2. Gestion des projets

Tous les endpoints ci-dessous nécessitent une authentification.

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | Lister les projets accessibles |
| `POST` | `/api/projects` | Créer un projet appartenant à l'utilisateur connecté |
| `GET` | `/api/projects/{id}` | Consulter un projet accessible |
| `PATCH` | `/api/projects/{id}` | Modifier les champs envoyés |
| `DELETE` | `/api/projects/{id}` | Supprimer un projet et toutes ses tâches |

Un projet comporte `nom` (obligatoire, 3 à 100 caractères), `description` (facultative, 1 000 caractères maximum) et `statut`. Les statuts possibles sont `en_cours`, `termine` et `en_pause`; le statut par défaut est `en_cours`. Les dates `createdAt` et `updatedAt` sont gérées automatiquement.

### Recherche, filtres et tri des projets

Les paramètres de requête s'appliquent à `GET /api/projects` et peuvent être combinés.

| Paramètre | Description | Valeurs et comportement |
| --- | --- | --- |
| `search` | Recherche de texte dans le nom **ou** la description | Sous-chaîne, insensible à la casse; 100 caractères maximum |
| `statut` | Filtre les projets sur leur statut | `en_cours`, `termine`, `en_pause` |
| `sort` | Champ utilisé pour ordonner les résultats | `nom`, `statut`, `createdAt` |
| `order` | Sens du tri | `asc` (croissant) ou `desc` (décroissant) |

La recherche est une correspondance partielle : `search=site` peut retrouver « Nouveau site web ». Les caractères spéciaux de recherche sont traités comme du texte littéral. Si `search` et `statut` sont fournis, le projet doit correspondre au texte **et** au statut; la recherche teste le nom ou la description.

Le tri par défaut est `createdAt` en ordre `desc` (du plus récent au plus ancien). Les valeurs de `sort` et `order` sont indépendantes : par exemple, `sort=nom` sans `order` trie les noms en ordre décroissant. Les paramètres invalides ou un `search` dépassant 100 caractères donnent une erreur HTTP `400`.

Exemple combinant recherche, statut et tri :

```http
GET /api/projects?search=site&statut=en_cours&sort=nom&order=asc
```

Autres exemples :

```http
# Tous les projets accessibles, triés par statut décroissant
GET /api/projects?sort=statut&order=desc

# Tous les projets accessibles dont la description ou le nom contient « refonte »
GET /api/projects?search=refonte
```

## 3. Gestion des tâches

Tous les endpoints ci-dessous nécessitent une authentification.

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/tasks` | Lister les tâches d'un projet accessible |
| `POST` | `/api/projects/{projectId}/tasks` | Créer une tâche dans un projet existant |
| `GET` | `/api/tasks/{id}` | Consulter une tâche accessible |
| `PATCH` | `/api/tasks/{id}` | Modifier les champs envoyés |
| `DELETE` | `/api/tasks/{id}` | Supprimer une tâche accessible |
| `PATCH` | `/api/tasks/{id}/assign` | Affecter une tâche (manager seulement) |

Une tâche comporte `titre` (obligatoire, 3 à 150 caractères), `description` (facultative, 1 000 caractères maximum), `deadline` (obligatoire, date au format ISO 8601) et `statut`. Les statuts possibles sont `todo`, `doing` et `done`; le statut par défaut est `todo`. `createdAt` et `updatedAt` sont ajoutés automatiquement. Une tâche non affectée a `utilisateurAssigne` à `null`.

Pour affecter une tâche, envoyer `utilisateurAssigne` (identifiant MongoDB de l'utilisateur) dans le corps JSON de `PATCH /api/tasks/{id}/assign`. L'utilisateur cible doit exister.

### Recherche, filtres et tri des tâches

Les paramètres s'appliquent à `GET /api/projects/{projectId}/tasks`. Les résultats sont toujours limités au projet indiqué et accessible par l'utilisateur.

| Paramètre | Description | Valeurs et comportement |
| --- | --- | --- |
| `search` | Recherche de texte dans le titre **ou** la description | Sous-chaîne, insensible à la casse; 100 caractères maximum |
| `statut` | Filtre les tâches sur leur statut | `todo`, `doing`, `done` |
| `sort` | Champ utilisé pour ordonner les résultats | `titre`, `statut`, `deadline`, `createdAt` |
| `order` | Sens du tri | `asc` (croissant) ou `desc` (décroissant) |

Comme pour les projets, la recherche est partielle et insensible à la casse; les caractères spéciaux sont recherchés littéralement. Recherche et statut se cumulent : une tâche doit correspondre au texte dans son titre ou sa description et avoir le statut demandé. Le tri par défaut est `createdAt` décroissant. Si un autre `sort` est choisi sans `order`, le sens reste `desc`. Un paramètre invalide ou un texte de recherche de plus de 100 caractères entraîne une erreur HTTP `400`.

Exemple : tâches contenant « rapport », au statut `todo`, avec l'échéance la plus proche en premier :

```http
GET /api/projects/{projectId}/tasks?search=rapport&statut=todo&sort=deadline&order=asc
```

Exemple : toutes les tâches d'un projet triées par titre croissant :

```http
GET /api/projects/{projectId}/tasks?sort=titre&order=asc
```

Les listes de projets et de tâches ne proposent pas actuellement de pagination.

## Validation et erreurs

Les requêtes avec corps doivent utiliser du JSON (`Content-Type: application/json`). Pour les mises à jour `PATCH`, envoyer au moins un champ modifiable. Les identifiants dans les URL doivent être des identifiants MongoDB valides.

Les erreurs de validation de corps ou de paramètres de recherche/tri renvoient `400` et un objet contenant `message` et, pour les erreurs de validation, `errors`. Une route protégée sans jeton ou avec un jeton invalide/expiré renvoie `401`. Une ressource absente ou inaccessible renvoie `404`. Les réponses de succès renvoient les données sous une clé telle que `project`, `projects`, `task` ou `tasks`, éventuellement accompagnées d'un `message`.


