require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(
  morgan(function (tokens, req, res) {
    const method = tokens.method(req, res);
    const log = [
      method,
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ];

    if (method === 'POST') {
      log.push(JSON.stringify(req.body));
    }

    return log.join(' ');
  })
);

app.get('/', (request, response) => {
  response.redirect('/info');
});

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${
        persons.length
      } people</p><br/><p>${new Date().toString()}</p>`
    );
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing number or name',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const note = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
