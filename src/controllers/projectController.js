const mongoose = require("mongoose");
const projectService = require("../services/projectService");
// liste des messages d'erreur connus qui doivent être traités comme des erreurs côté client (400).
const clientErrors = new Set([
    "Champ de tri invalide",
    "Ordre de tri invalide",
    "Statut du projet invalide",
    "Aucun champ a modifier"
]);

// convertit les erreurs du service en réponses HTTP appropriées.
const respondWithError = (res, error) => {
    let status = 500;

    if (error.message === "Projet introuvable") {
        status = 404;
    } else if (error.code === 11000) {
        status = 409;
    } else if (
        error.name === "ValidationError" ||
        error.name === "CastError" ||
        clientErrors.has(error.message)
    ) {
        status = 400;
    }

    if (status === 500) {
        console.error("Erreur lors de la gestion des projets:", error);
        return res.status(status).json({
            message: "Erreur interne lors de la gestion des projets"
        });
    }

    return res.status(status).json({ message: error.message });
};

class ProjectController {
    // Retourne la liste des projets accessibles selon les filtres demandés.
    async list(req, res) {
        try {
            const projects = await projectService.list(req.user, req.query);
            return res.status(200).json({ projects });
        } catch (error) {
            return respondWithError(res, error);
        }
    }

    // Valide l'identifiant puis retourne le projet demandé.
    async getById(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Identifiant de projet invalide" });
        }

        try {
            const project = await projectService.getById(req.params.id, req.user);
            return res.status(200).json({ project });
        } catch (error) {
            return respondWithError(res, error);
        }
    }

    // Crée un projet appartenant à l'utilisateur connecté.
    async create(req, res) {
        try {
            const project = await projectService.create(req.body, req.user.id);
            return res.status(201).json({
                message: "Projet cree avec succes",
                project
            });
        } catch (error) {
            return respondWithError(res, error);
        }
    }

    // Valide l'identifiant puis applique les modifications au projet.
    async update(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Identifiant de projet invalide" });
        }

        try {
            const project = await projectService.update(
                req.params.id,
                req.body,
                req.user
            );
            return res.status(200).json({
                message: "Projet modifie avec succes",
                project
            });
        } catch (error) {
            return respondWithError(res, error);
        }
    }

    // Supprime le projet demandé s'il est accessible à l'utilisateur.
    async delete(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Identifiant de projet invalide" });
        }

        try {
            await projectService.delete(req.params.id, req.user);
            return res.status(200).json({ message: "Projet supprime avec succes" });
        } catch (error) {
            return respondWithError(res, error);
        }
    }
}

module.exports = new ProjectController();
