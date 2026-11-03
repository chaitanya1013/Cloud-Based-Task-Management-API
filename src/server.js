require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const db = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Task Management API is running"
    });
});

// Task routes
app.use("/api/tasks", taskRoutes);

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const connection = await db.getConnection();
        console.log("MySQL connected successfully!");
        connection.release();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();