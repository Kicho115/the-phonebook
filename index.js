const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
morgan.token('obj', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :obj'))


let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    } else if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.ceil(Math.random() * 999999)
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find((p) => p.id === id)
    person ? res.json(person) : res.status(404).end()
})


app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        persons = persons.filter(p => p.id !== id)
        res.status(204).end()
    }
    else {
        res.status(404).end()
    }
})


app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)