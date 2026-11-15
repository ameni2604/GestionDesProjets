const mongoose = require("mongoose");
const taskRepository = require("../repositories/taskRepository");
const projectRepository = require("../repositories/projectRepository");
const userRepository = require("../repositories/userRepository");

const TASK_STATUSES = ["todo", "doing", "done"];
const SORT_FIELDS = ["titre", "statut", "deadline", "createdAt"];

class TaskService {
    // traja3 ken  un projet accessible à l'utilisateur connecté.
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
// traj3 les tâches du projet selon les filtres et le tri demandés.
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
// trja3 tache accessible à l'utilisateur connecté selon son id
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
// cretaion d'une tâche vac l'id mte3 el projet
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
// modifier un tache
    async update(id, data, user) {
        const task = await this.getById(id, user);
        const updates = {};
        for (const field of ["titre", "description", "statut", "deadline"]) {
            if (data[field] !== undefined) updates[field] = data[field];
        }
        if (Object.keys(updates).length === 0) throw new Error("Aucun champ à modifier");
        return taskRepository.update(task._id, updates);
    }
// assigner une tache à un utilisateur
    async assign(id, userId) {
        if (!mongoose.isValidObjectId(id)) throw new Error("Identifiant de tâche invalide");
        if (!mongoose.isValidObjectId(userId)) throw new Error("Identifiant utilisateur invalide");
        const task = await taskRepository.findById(id);
        if (!task) throw new Error("Tâche introuvable");
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("Utilisateur à affecter introuvable");
        return taskRepository.update(id, { utilisateurAssigne: userId });
    }
// supprission d'une tache
    async delete(id, user) {
        const task = await this.getById(id, user);
        await taskRepository.delete(task._id);
    }
}

module.exports = new TaskService();
