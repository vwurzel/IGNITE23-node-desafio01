import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoadPath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoadPath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select('tasks')

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoadPath('/tasks'),
        handler: (req, res) => {
            const {
                title,
                description
            } = req.body

            if(!title || !description) {
                return res.writeHead(400).end()
            }

            const task = {
                id: randomUUID(),
                title: title,
                description: description,
                created_at: new Date,
                completed_at: null,
                updated_at: null
            }

            database.insert('tasks', task)
            return res
                .writeHead(201)
                .end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoadPath('/tasks/:id'),
        handler: (req, res) => {
            const id = req.params.id

            database.delete('tasks', id)

            return res.writeHead(200).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoadPath('/tasks/:id'),
        handler: (req, res) => {
            const id = req.params.id
            const { title, description } = req.body
            
            database.update('tasks', id, { title, description })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoadPath('/tasks/:id/complete'),
        handler: (req, res) => {
            const id = req.params.id
            database.update('tasks', id, 'complete')

            return res.writeHead(204).end()
        }
    }
]