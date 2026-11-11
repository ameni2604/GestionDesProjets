const Project = require("../models/Project");

class ProjectRepository {
    // Na3mlou recherche b texte escaped bech ma yetfasserch regex mel utilisateur.
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

    // El projet yethal ken lel owner mte3ou wala lel manager.
    async findAccessibleById(id, userId, isManager) {
        const filter = { _id: id };

        if (!isManager) {
            filter.proprietaire = userId;
        }

        return Project.findOne(filter).populate("proprietaire", "nom login");
    }

    async create(projectData) {
        const project = await Project.create(projectData);
        return project.populate("proprietaire", "nom login");
    }

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

    async deleteAccessibleById(id, userId, isManager) {
        const filter = { _id: id };

        if (!isManager) {
            filter.proprietaire = userId;
        }

        return Project.findOneAndDelete(filter);
    }
}

module.exports = new ProjectRepository();
