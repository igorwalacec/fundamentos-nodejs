import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route.path.js";

const database = new Database();
const table = 'tasks';

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
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

            response.writeHead(201).end(JSON.stringify(task));
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: async (request, response) => {
            const { search } = request.query;
            const tasks = database.select(table, search 
                ? { title: search, description: search   } 
                : null
            );            
            response.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: async (request, response) => {
            const { id } = request.params;
            const { title, description } = request.body;

            if (!title && !description) {
                return res.writeHead(400).end(JSON.stringify({ message: 'Title or Description are required' }));
              }

            const task = database.findById(table, id);
            if(!task) {
                return response.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }

            const updatedTask = {
                ...task,
                title: title || task.title,
                description: description || task.description,                
                updated_at: new Date().toISOString()
            }

            database.update(table, id, updatedTask);

            response.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: async (request, response) => {
            const { id } = request.params;

            const task = database.findById(table, id);
            if(!task) {
                return response.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }

            database.delete(table, id);

            response.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completed'),
        handler: async (request, response) => {
            const { id } = request.params;

            const task = database.findById(table, id);
            if(!task) {
                return response.writeHead(404).end(JSON.stringify({ message: 'Task not found' }));
            }

            const updatedTask = {
                ...task,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            database.update(table, id, updatedTask);

            response.writeHead(204).end();
        }
    }
];

