import fs from 'node:fs/promises';

const databasePath = new URL('db.json', import.meta.url);

export class Database {
    #database = {};

    constructor() {
        this.#load();
    }

    #load(){    
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#database = JSON.parse(data);
            }).catch(() => {
                this.#persist();
            });
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        }else{
            this.#database[table] = [data];
        }

        this.#persist();
        return data;
    }

    select(table, search){
        let data = this.#database[table] ?? [];
        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase());
                });
            });           
        }
        return data;
    }

    findById(table, id) {
        return this.#database[table].find(row => row.id === id);
    }

    update(table, id, data) {
        const index = this.#database[table].findIndex(row => row.id === id);
        if(index === -1) {
            return null;
        }

        this.#database[table][index] = { ...this.#database[table][index], ...data };
        this.#persist();
        return this.#database[table][index];
    }

    delete(table, id) {
        const index = this.#database[table].findIndex(row => row.id === id);
        if(index === -1) {
            return false;
        }

        this.#database[table].splice(index, 1);
        this.#persist();
        return true;
    }
}