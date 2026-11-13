const Task = require("../models/Task");

class TaskRepository {
    // Houni n'affichiw ken les tâches mta3 projet accessible lel user.
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

    async findById(id) {
        return Task.findById(id)
            .populate({ path: "projet", select: "nom proprietaire", populate: { path: "proprietaire", select: "nom login" } })
            .populate("utilisateurAssigne", "nom login");
    }

    async create(data) {
        const task = await Task.create(data);
        return this.findById(task._id);
    }

    async update(id, updates) {
        return Task.findByIdAndUpdate(id, { $set: updates }, {
            new: true,
            runValidators: true
        })
            .populate({ path: "projet", select: "nom proprietaire", populate: { path: "proprietaire", select: "nom login" } })
            .populate("utilisateurAssigne", "nom login");
    }

    async delete(id) {
        return Task.findByIdAndDelete(id);
    }

    async deleteByProject(projectId) {
        return Task.deleteMany({ projet: projectId });
    }
}

module.exports = new TaskRepository();
