const mongoose = require("mongoose");
const projectService = require("../services/projectService");

const clientErrors = new Set([
    "Champ de tri invalide",
    "Ordre de tri invalide",
    "Statut du projet invalide",
    "Aucun champ a modifier"
]);

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
    async list(req, res) {
        try {
            const projects = await projectService.list(req.user, req.query);
            return res.status(200).json({ projects });
        } catch (error) {
            return respondWithError(res, error);
        }
    }

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
