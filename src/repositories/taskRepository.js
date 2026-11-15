const Task = require("../models/Task");

class TaskRepository {
    // Recherche, filtre et trie les tâches d'un projet.
    async findMany({ projectId, search, statut, sort, order }) {
        const filter = { projet: projectId };
        if (statut) filter.statut = statut;

        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const expression = new RegExp(escaped, "i");
            filter.$or = [
                { titre: expression },
                { description: expression }
            ];
        }

        return Task.find(filter)
            .populate({ path: "projet", select: "nom proprietaire", populate: { path: "proprietaire", select: "nom login" } })
            .populate("utilisateurAssigne", "nom login")
            .sort({ [sort]: order });
    }

    // Récupère une tâche par son identifiant avec son projet et son assigné.
    async findById(id) {
        return Task.findById(id)
            .populate({ path: "projet", select: "nom proprietaire", populate: { path: "proprietaire", select: "nom login" } })
            .populate("utilisateurAssigne", "nom login");
    }

    // Crée une tâche et retourne ses relations peuplées.
    async create(data) {
        const task = await Task.create(data);
        return this.findById(task._id);
    }

    // Modifie une tâche et retourne sa nouvelle version avec ses relations.
    async update(id, updates) {
        return Task.findByIdAndUpdate(id, { $set: updates }, {
            new: true,
            runValidators: true
        })
            .populate({ path: "projet", select: "nom proprietaire", populate: { path: "proprietaire", select: "nom login" } })
            .populate("utilisateurAssigne", "nom login");
    }

    // Supprime une tâche par son identifiant.
    async delete(id) {
        return Task.findByIdAndDelete(id);
    }

    // Supprime toutes les tâches liées à un projet.
    async deleteByProject(projectId) {
        return Task.deleteMany({ projet: projectId });
    }
}

module.exports = new TaskRepository();
