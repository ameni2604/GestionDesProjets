const projectRepository = require("../repositories/projectRepository");
const taskRepository = require("../repositories/taskRepository");
const PROJECT_STATUSES = ["en_cours", "termine", "en_pause"];
const SORT_FIELDS = ["nom", "statut", "createdAt"];

class ProjectService {
    // lister les projets accessibles à l'utilisateur avec des options de recherche, de filtrage et de tri.
    async list(user, query) {
        // definition mte3 el sort w order par defaut ken ma fama7ch fi query
        const sort = query.sort || "createdAt";
        const order = query.order || "desc";
        // validation des paramètres de tri et de filtre
        if (!SORT_FIELDS.includes(sort)) {
            throw new Error("Champ de tri invalide");
        }
        // validation de l'ordre de tri
        if (!["asc", "desc"].includes(order)) {
            throw new Error("Ordre de tri invalide");
        }
        // validation du statut du projet
        if (query.statut && !PROJECT_STATUSES.includes(query.statut)) {
            throw new Error("Statut du projet invalide");
        }

        return projectRepository.findMany({
            userId: user.id,
            // isManager: user.role === "manager" ya3ni ken el utilisateur role mte3ou manager yjiblou les projets mta3 kol les utilisateurs
            isManager: user.role === "manager",
            search: query.search,
            statut: query.statut,
            sort,
            order: order === "asc" ? 1 : -1
        });
    }
// retourne un projet accessible à l'utilisateur connecté
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
// creation d'un projet appartenant à l'utilisateur connecte
    async create(data, userId) {
        return projectRepository.create({
            nom: data.nom,
            description: data.description,
            statut: data.statut,
            proprietaire: userId
        });
    }
// modifier un projet accessible à l'utilisateur connecte
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
// supprimer un projet accessible à l'utilisateur connecté w  les tâches mte3o
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
