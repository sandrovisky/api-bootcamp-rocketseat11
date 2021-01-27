const express = require('express')
const cors = require('cors')
const {uuid, isUuid} = require ('uuidv4')

const app = express()

app.use(cors())
app.use(express.json())

const projects = []

function logRequest(request, response, next) {

    const { method, url } = request

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel)

    return next()

}

function validateProjectId(request, response, next) {

    const { id } = request.params

    if(!isUuid(id)){
        return response.status(400).json({ error: 'Invalid project ID' }) //se entrar nesse comando nao sera executado mais nada, msm havendo um next
    }

    return next()
}

app.use(logRequest)

//app.use('/projects/:id', validateProjectId, ) => outra forma de usar middlewares

app.get('/projects', (request, response) => {

    const { title } = request.query

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects
    console.log(title)

    return response.json(results)
})

app.post('/projects', (request, response) => {

    const { title , owner } = request.body
    const project = {id: uuid(), title, owner}
    projects.push(project)

    console.log(title)
    console.log(owner)
    return response.json(project)
})

app.put('/projects/:id', validateProjectId, (request, response) => {

    const { id } = request.params
    const { title , owner } = request.body

    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return response.status(400).json({error: 'project not found.'})
    }

    const project ={
        id,
        title,
        owner,
    }

    projects[projectIndex] = project

    return response.json('Projeto atualizado com sucesso!')
})

app.delete('/projects/:id', validateProjectId, (request, response) => {

    const { id } = request.params
    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return response.status(400).json({error: 'project not found.'})
    }

    projects.splice(projectIndex, 1)

    return response.json('Projeto deletado com sucesso!')
})

app.listen(3333, () => {
    console.log('🚀 Back-end started!')
})