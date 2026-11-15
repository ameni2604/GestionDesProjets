const Project = require("../models/Project");

class ProjectRepository {
    // Recherche, filtre et trie les projets accessibles à l'utilisateur.
    async findMany({ userId, isManager, search, statut, sort, order }) {
        const filter = {};

        if (!isManager) {
            filter.proprietaire = userId;
        }

        if (statut) {
            filter.statut = statut;
        }

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const expression = new RegExp(escapedSearch, "i");
            filter.$or = [
                { nom: expression },
                { description: expression }
            ];
        }

        return Project.find(filter)
            .populate("proprietaire", "nom login")
            .sort({ [sort]: order });
    }

    // Récupère un projet uniquement s'il est accessible à l'utilisateur.
    async findAccessibleById(id, userId, isManager) {
        const filter = { _id: id };

        if (!isManager) {
            filter.proprietaire = userId;
        }

        return Project.findOne(filter).populate("proprietaire", "nom login");
    }

    // Crée un projet et retourne son propriétaire avec ses informations.
    async create(projectData) {
        const project = await Project.create(projectData);
        return project.populate("proprietaire", "nom login");
    }

    // Récupère un projet par son identifiant avec son propriétaire.
    async findById(id) {
        return Project.findById(id).populate("proprietaire", "nom login");
    }

    // Modifie un projet accessible et retourne sa nouvelle version.
    async updateAccessibleById(id, userId, isManager, updates) {
        const filter = { _id: id };

        if (!isManager) {
            filter.proprietaire = userId;
        }

        return Project.findOneAndUpdate(filter, { $set: updates }, {
            new: true,
            runValidators: true
        }).populate("proprietaire", "nom login");
    }

    // Supprime un projet uniquement s'il est accessible à l'utilisateur.
    async deleteAccessibleById(id, userId, isManager) {
        const filter = { _id: id };

        if (!isManager) {
            filter.proprietaire = userId;
        }

        return Project.findOneAndDelete(filter);
    }
}

module.exports = new ProjectRepository();
