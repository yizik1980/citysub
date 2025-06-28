import TodoAPI from './task-api.js'; // Note the .js extension is required for ES modules

async function startServer() {
    try {
        // Create a new instance of the Todo API
        const todoAPI = new TodoAPI();

        // Start the server
        const PORT = process.env.PORT || 3000;
        const server = await todoAPI.start(PORT);
        console.log(`Todo API server is running on http://localhost:${PORT}`);
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('Shutting down server...');
            server.close(() => {
                console.log('Server shut down gracefully');
                process.exit(0);
            });
        });
        process.on('SIGTERM', () => {
            console.log('Shutting down server...');
            server.close(() => {
                console.log('Server shut down gracefully');
                process.exit(0);
            });
        });

        // Return todoAPI for potential external use
        return todoAPI;

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
const todoAPI = await startServer();

// Example of using the module programmatically:
/*
import TodoAPI from './todoAPI.js';

const todoAPI = new TodoAPI();

// Get all todos
console.log('Current todos:', todoAPI.getTodos());

// Export to a custom Excel file path
todoAPI.exportToExcel('./custom-todos.xlsx')
  .then(filePath => console.log(`Exported to: ${filePath}`))
  .catch(err => console.error('Export failed:', err));
*/

export default todoAPI;