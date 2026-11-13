const mongoose = require("mongoose");
const taskRepository = require("../repositories/taskRepository");
const projectRepository = require("../repositories/projectRepository");
const userRepository = require("../repositories/userRepository");

const TASK_STATUSES = ["todo", "doing", "done"];
const SORT_FIELDS = ["titre", "statut", "deadline", "createdAt"];

class TaskService {
    // User ينجم يخدم كان على projet متاعو؛ manager ينجم على الكل.
    async getAccessibleProject(projectId, user) {
        if (!mongoose.isValidObjectId(projectId)) {
            throw new Error("Identifiant de projet invalide");
        }
        const project = await projectRepository.findAccessibleById(
            projectId,
            user.id,
            user.role === "manager"
        );
        if (!project) throw new Error("Projet introuvable");
        return project;
    }

    async list(projectId, query, user) {
        await this.getAccessibleProject(projectId, user);
        const sort = query.sort || "createdAt";
        const order = query.order || "desc";
        if (!SORT_FIELDS.includes(sort)) throw new Error("Champ de tri invalide");
        if (!["asc", "desc"].includes(order)) throw new Error("Ordre de tri invalide");
        if (query.statut && !TASK_STATUSES.includes(query.statut)) {
            throw new Error("Statut de tâche invalide");
        }
        return taskRepository.findMany({
            projectId,
            search: query.search,
            statut: query.statut,
            sort,
            order: order === "asc" ? 1 : -1
        });
    }

    async getById(id, user) {
        if (!mongoose.isValidObjectId(id)) throw new Error("Identifiant de tâche invalide");
        const task = await taskRepository.findById(id);
        if (!task) throw new Error("Tâche introuvable");
        const ownerId = task.projet.proprietaire._id.toString();
        if (user.role !== "manager" && ownerId !== user.id) {
            throw new Error("Tâche introuvable");
        }
        return task;
    }

    async create(projectId, data) {
        if (!mongoose.isValidObjectId(projectId)) {
            throw new Error("Identifiant de projet invalide");
        }
        const project = await projectRepository.findById(projectId);
        if (!project) throw new Error("Projet introuvable");

        // L'affectation n'est jamais acceptée depuis la route de création.
        return taskRepository.create({
            titre: data.titre,
            description: data.description,
            statut: data.statut,
            deadline: data.deadline,
            projet: projectId
        });
    }

    async update(id, data, user) {
        const task = await this.getById(id, user);
        const updates = {};
        for (const field of ["titre", "description", "statut", "deadline"]) {
            if (data[field] !== undefined) updates[field] = data[field];
        }
        if (Object.keys(updates).length === 0) throw new Error("Aucun champ à modifier");
        return taskRepository.update(task._id, updates);
    }

    async assign(id, userId) {
        if (!mongoose.isValidObjectId(id)) throw new Error("Identifiant de tâche invalide");
        if (!mongoose.isValidObjectId(userId)) throw new Error("Identifiant utilisateur invalide");
        const task = await taskRepository.findById(id);
        if (!task) throw new Error("Tâche introuvable");
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("Utilisateur à affecter introuvable");
        return taskRepository.update(id, { utilisateurAssigne: userId });
    }

    async delete(id, user) {
        const task = await this.getById(id, user);
        await taskRepository.delete(task._id);
    }
}

module.exports = new TaskService();
