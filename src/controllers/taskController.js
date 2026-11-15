const taskService = require("../services/taskService");

// Convertit les erreurs du service en réponses HTTP appropriées.
const respondWithError = (res, error) => {
    const notFound = ["Projet introuvable", "Tâche introuvable", "Utilisateur à affecter introuvable"];
    const badRequest = [
        "Identifiant de projet invalide", "Identifiant de tâche invalide",
        "Identifiant utilisateur invalide", "Champ de tri invalide",
        "Ordre de tri invalide", "Statut de tâche invalide", "Aucun champ à modifier"
    ];
    let status = notFound.includes(error.message) ? 404 : 500;
    if (badRequest.includes(error.message) || error.name === "ValidationError" || error.name === "CastError") status = 400;
    if (status === 500) {
        console.error("Erreur lors de la gestion des tâches:", error);
        return res.status(500).json({ message: "Erreur interne lors de la gestion des tâches" });
    }
    return res.status(status).json({ message: error.message });
};

class TaskController {
    // Retourne les tâches du projet selon les filtres et le tri demandés.
    async list(req, res) {
        try {
            const tasks = await taskService.list(req.params.projectId, req.query, req.user);
            return res.status(200).json({ tasks });
        } catch (error) { return respondWithError(res, error); }
    }
    // Retourne une tâche accessible à l'utilisateur connecté.
    async getById(req, res) {
        try {
            const task = await taskService.getById(req.params.id, req.user);
            return res.status(200).json({ task });
        } catch (error) { return respondWithError(res, error); }
    }
    // Crée une tâche dans le projet indiqué.
    async create(req, res) {
        try {
            const task = await taskService.create(req.params.projectId, req.body);
            return res.status(201).json({ message: "Tâche créée avec succès", task });
        } catch (error) { return respondWithError(res, error); }
    }
    // Modifie une tâche accessible à l'utilisateur connecté.
    async update(req, res) {
        try {
            const task = await taskService.update(req.params.id, req.body, req.user);
            return res.status(200).json({ message: "Tâche modifiée avec succès", task });
        } catch (error) { return respondWithError(res, error); }
    }
    // Affecte une tâche à l'utilisateur indiqué.
    async assign(req, res) {
        try {
            const task = await taskService.assign(req.params.id, req.body.utilisateurAssigne);
            return res.status(200).json({ message: "Tâche affectée avec succès", task });
        } catch (error) { return respondWithError(res, error); }
    }
    // Supprime une tâche accessible à l'utilisateur connecté.
    async delete(req, res) {
        try {
            await taskService.delete(req.params.id, req.user);
            return res.status(200).json({ message: "Tâche supprimée avec succès" });
        } catch (error) { return respondWithError(res, error); }
    }
}

module.exports = new TaskController();
