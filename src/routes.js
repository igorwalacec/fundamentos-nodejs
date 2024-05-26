import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

const database = new Database();
const table = 'tasks';

export const routes = [
    {
        method: 'POST',
        path: '/tasks',
        handler: async (request, response) => {
            const { title, description } = request.body;
            
            if(!title) {
                return response.writeHead(400).end(JSON.stringify({ message: 'Title and description are required' }));
            }
            if(!description) {
                return response.writeHead(400).end(JSON.stringify({ message: 'Description is required' }));
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: null
            }

            database.insert(table, task);

            response.end(JSON.stringify(task));
        }
    },
    {
        method: 'GET',
        path: '/tasks',
        handler: async (request, response) => {
            const tasks = database.select(table);
            response.end(JSON.stringify(tasks));
        }
    }
];