require('dotenv').config()
const Note = require('./models/note')
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('build'))

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.cleparams.id).then(note => {
    if(note) response.json(note)
    else response.status(404).end()
  })
  .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.param.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) { //if the content property of the note does not exist
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false, //if we dont put an important property then we do false by default
    date: new Date()
  })

  //mongodb save
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body 

  const note = {
    content: body.content, 
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})