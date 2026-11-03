
const db = require("../config/db");

// 1. Create a task
const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO tasks (title, description, status)
             VALUES (?, ?, ?)`,
            [
                title.trim(),
                description || null,
                status || "pending"
            ]
        );

        res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
};

// 2. Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const [tasks] = await db.execute(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        );

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
};

// 3. Get task by ID
const getTaskById = async (req, res) => {
    try {
        const [tasks] = await db.execute(
            "SELECT * FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(tasks[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch task",
            error: error.message
        });
    }
};

// 4. Update task
const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const [result] = await db.execute(
            `UPDATE tasks
             SET title = ?, description = ?, status = ?
             WHERE id = ?`,
            [title, description, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
};

// 5. Delete task
const deleteTask = async (req, res) => {
    try {
        const [result] = await db.execute(
            "DELETE FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
