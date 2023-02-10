import fs from 'node:fs/promises'


const databasePath = new URL('db.json', import.meta.url)

export class Database{
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }
    
    select(table) {
        let data = this.#database[table] ?? []

        return data
    }
    
    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)

            this.#persist()
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if(rowIndex > -1){

            if(data === 'complete') {
                const title = this.#database[table][rowIndex].title
                const description = this.#database[table][rowIndex].description
                const created_at = this.#database[table][rowIndex].created_at
                const updated_at = this.#database[table][rowIndex].updated_at
                this.#database[table][rowIndex] = { id, title, description, updated_at, created_at, completed_at: new Date}
            } else {
                const created_at = this.#database[table][rowIndex].created_at
                this.#database[table][rowIndex] = { id, ...data, updated_at: new Date, created_at, completed_at: null}
            }

            this.#persist()
        }
    }
}