const projectRepository = require("../repositories/projectRepository");
const taskRepository = require("../repositories/taskRepository");
const PROJECT_STATUSES = ["en_cours", "termine", "en_pause"];
const SORT_FIELDS = ["nom", "statut", "createdAt"];

class ProjectService {
    async list(user, query) {
        const sort = query.sort || "createdAt";
        const order = query.order || "desc";

        if (!SORT_FIELDS.includes(sort)) {
            throw new Error("Champ de tri invalide");
        }

        if (!["asc", "desc"].includes(order)) {
            throw new Error("Ordre de tri invalide");
        }

        if (query.statut && !PROJECT_STATUSES.includes(query.statut)) {
            throw new Error("Statut du projet invalide");
        }

        return projectRepository.findMany({
            userId: user.id,
            isManager: user.role === "manager",
            search: query.search,
            statut: query.statut,
            sort,
            order: order === "asc" ? 1 : -1
        });
    }

    async getById(id, user) {
        const project = await projectRepository.findAccessibleById(
            id,
            user.id,
            user.role === "manager"
        );

        if (!project) {
            throw new Error("Projet introuvable");
        }

        return project;
    }

    async create(data, userId) {
        return projectRepository.create({
            nom: data.nom,
            description: data.description,
            statut: data.statut,
            proprietaire: userId
        });
    }

    async update(id, data, user) {
        const updates = {};

        for (const field of ["nom", "description", "statut"]) {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            throw new Error("Aucun champ a modifier");
        }

        if (updates.statut && !PROJECT_STATUSES.includes(updates.statut)) {
            throw new Error("Statut du projet invalide");
        }

        const project = await projectRepository.updateAccessibleById(
            id,
            user.id,
            user.role === "manager",
            updates
        );

        if (!project) {
            throw new Error("Projet introuvable");
        }

        return project;
    }

    async delete(id, user) {
        const project = await projectRepository.findAccessibleById(
            id,
            user.id,
            user.role === "manager"
        );

        if (!project) throw new Error("Projet introuvable");

        await taskRepository.deleteByProject(id);
        return projectRepository.deleteAccessibleById(id, user.id, user.role === "manager");
    }
            
}

         
    


module.exports = new ProjectService();
