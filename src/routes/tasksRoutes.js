const express = require("express");
const taskController = require("../controllers/taskController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
    createTaskValidator, updateTaskValidator, listTasksValidator, assignTaskValidator
} = require("../validators/taskValidator");

const router = express.Router();
router.use(authenticate);

// Routes de consultation et de modification des tâches accessibles.
router.get("/projects/:projectId/tasks", listTasksValidator, validateRequest, (req, res) => taskController.list(req, res));
router.post("/projects/:projectId/tasks", createTaskValidator, validateRequest, (req, res) => taskController.create(req, res));
router.get("/tasks/:id", (req, res) => taskController.getById(req, res));
router.patch("/tasks/:id", updateTaskValidator, validateRequest, (req, res) => taskController.update(req, res));
router.delete("/tasks/:id", (req, res) => taskController.delete(req, res));

// Ken el manager ينجم يعيّن tâche لمستخدم آخر.
router.patch("/tasks/:id/assign", authorize("manager"), assignTaskValidator, validateRequest, (req, res) => taskController.assign(req, res));

module.exports = router;
