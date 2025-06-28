import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import  cors from "cors";
// Get current directory for ES modules
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);


class TodoAPI {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.todos = [{
                id: 1,
                title: "Learn Node.js",
                description: "how you doing?",
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 2,
                title: "Build API",
                description: "Create a CRUD API with Express",
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        this.nextId = 3;

        this.jsonBackupPath = path.join(process.cwd(), "todos.json");

        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());

        // Error handling middleware
        this.app.use((err, req, res, next) => {
            console.error("API Error:", err.message);
            res.status(500).json({
                success: false,
                message: "Something went wrong!",
                error: process.env.NODE_ENV === "development" ? err.message : undefined,
            });
        });
    }

    setupRoutes() {
        // GET /api/tasks - Get all todos
        this.app.get("/api/tasks", (req, res) => {
            res.json({
                success: true,
                body: this.todos,
                count: this.todos.length,
                excelEnabled: this.excelEnabled,
            });
        });

        // GET /api/tasks/:id - Get a specific todo
        this.app.get("/api/tasks/:id", (req, res) => {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid todo ID",
                });
            }

            const todo = this.todos.find((t) => t.id === id);

            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: "Todo not found",
                });
            }

            res.json({
                success: true,
                body: todo,
            });
        });

        // POST /api/tasks - Create a new todo
        this.app.post("/api/tasks", async(req, res) => {
            try {
                const { title, description } = req.body;

                // Validation
                if (!title || typeof title !== "string" || title.trim() === "") {
                    return res.status(400).json({
                        success: false,
                        message: "Title is required and must be a non-empty string",
                    });
                }

                const now = new Date().toISOString();
                const newTodo = {
                    id: this.nextId++,
                    title: title.trim(),
                    description: description && typeof description === "string" ?
                        description.trim() : "",
                    completed: false,
                    createdAt: now,
                    updatedAt: now,
                };

                this.todos.push(newTodo);

                // Save to files
                await this.saveData();

                res.status(201).json({
                    success: true,
                    data: newTodo,
                    message: `Todo created successfully${
            this.excelEnabled ? " and saved to Excel" : ""
          }`,
                });
            } catch (error) {
                console.error("Error creating todo:", error);
                res.status(500).json({
                    success: false,
                    message: "Error creating todo",
                });
            }
        });

        // PUT /api/tasks/:id - Update a todo
        this.app.put("/api/tasks/:id", async(req, res) => {
            try {
                const id = parseInt(req.params.id);

                if (isNaN(id)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid todo ID",
                    });
                }

                const todoIndex = this.todos.findIndex((t) => t.id === id);

                if (todoIndex === -1) {
                    return res.status(404).json({
                        success: false,
                        message: "Todo not found",
                    });
                }

                const { title, description, completed } = req.body;

                // Validation
                if (
                    title !== undefined &&
                    (typeof title !== "string" || title.trim() === "")
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Title must be a non-empty string",
                    });
                }

                // Update todo
                if (title !== undefined) this.todos[todoIndex].title = title.trim();
                if (description !== undefined) {
                    this.todos[todoIndex].description =
                        typeof description === "string" ? description.trim() : "";
                }
                if (completed !== undefined)
                    this.todos[todoIndex].completed = Boolean(completed);
                this.todos[todoIndex].updatedAt = new Date().toISOString();

                // Save to files
                await this.saveData();

                res.json({
                    success: true,
                    data: this.todos[todoIndex],
                    message: `Todo updated successfully${
            this.excelEnabled ? " and saved to Excel" : ""
          }`,
                });
            } catch (error) {
                console.error("Error updating todo:", error);
                res.status(500).json({
                    success: false,
                    message: "Error updating todo",
                });
            }
        });

        // DELETE /api/tasks/:id - Delete a todo
        this.app.delete("/api/tasks/:id", async(req, res) => {
            try {
                const id = parseInt(req.params.id);

                if (isNaN(id)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid todo ID",
                    });
                }

                const todoIndex = this.todos.findIndex((t) => t.id === id);

                if (todoIndex === -1) {
                    return res.status(404).json({
                        success: false,
                        message: "Todo not found",
                    });
                }

                const deletedTodo = this.todos.splice(todoIndex, 1)[0];

                // Save to files
                await this.saveData();

                res.json({
                    success: true,
                    data: deletedTodo,
                    message: `Todo deleted successfully${
            this.excelEnabled ? " and Excel file updated" : ""
          }`,
                });
            } catch (error) {
                console.error("Error deleting todo:", error);
                res.status(500).json({
                    success: false,
                    message: "Error deleting todo",
                });
            }
        });

        // GET /api/status - API status
        this.app.get("/api/status", (req, res) => {
            res.json({
                success: true,
                message: "Todo API is running",
                excelEnabled: this.excelEnabled,
                todosCount: this.todos.length,
                excelFilePath: this.excelEnabled ? this.excelFilePath : null,
            });
        });

        // 404 handler
        this.app.use(/(.*)/, (req, res) => {
            res.status(404).json({
                success: false,
                message: "Route not found",
            });
        });
    }


    async writeToJSON() {
        try {
            const jsonData = {
                todos: this.todos,
                nextId: this.nextId,
                lastUpdated: new Date().toISOString(),
            };

            await fs.writeFile(
                this.jsonBackupPath,
                JSON.stringify(jsonData, null, 2)
            );
            console.log(`JSON backup saved: ${this.jsonBackupPath}`);
        } catch (error) {
            console.error("Error writing JSON backup:", error);
        }
    }

    async saveData() {
        const promises = [this.writeToJSON()];
        await Promise.allSettled(promises);
    }

    async loadFromJSON() {
        try {
            await fs.access(this.jsonBackupPath);

            const jsonData = await fs.readFile(this.jsonBackupPath, "utf8");
            const data = JSON.parse(jsonData);

            if (data.todos && Array.isArray(data.todos)) {
                this.todos = data.todos;
                this.nextId =
                    data.nextId || Math.max(...this.todos.map((t) => t.id)) + 1;
                console.log(`Loaded ${this.todos.length} todos from JSON backup`);
                return true;
            }
        } catch (error) {
            console.log("No existing data files found, starting with default todos");
        }

        return false;
    }

    async start(port = 3000) {
        await this.loadFromJSON();

        // Save current data
        await this.saveData();

        return new Promise((resolve) => {
            const server = this.app.listen(port, () => {
                console.log(`\n🚀 Todo API Server is running on port ${port}`);
                console.log(`📄 JSON backup: ${this.jsonBackupPath}`);
                console.log(`\n📋 API Endpoints:`);
                console.log(`   GET    /api/status`);
                console.log(`   GET    /api/tasks`);
                console.log(`   GET    /api/tasks/:id`);
                console.log(`   POST   /api/tasks`);
                console.log(`   PUT    /api/tasks/:id`);
                console.log(`   DELETE /api/tasks/:id`);
                console.log(`   GET    /api/tasks/completed/:status`);

                console.log(`\n✅ Ready to handle requests!`);
                resolve(server);
            });
        });
    }

    getApp() {
        return this.app;
    }

    getTodos() {
        return this.todos;
    }
}

export default TodoAPI;