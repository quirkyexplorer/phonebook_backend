const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors()); // middleware that allows cross origin requests.
app.use(morgan('tiny'));
app.use(morgan({format:':body', immediate: true})); // using a format string
morgan.token('body', res => { return JSON.stringify(res.body)})
// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method);
//     console.log('Path:  ', request.path);
//     console.log('Body:  ', request.body);
//     console.log('---');
//     next();
//   }

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

let persons = [
  {
    name: "Daniel",
    number: "602-456-7894",
    id: 2,
  },
  {
    name: "Pao",
    number: "456-456-8569",
    id: 9,
  },
  {
    name: "Luis",
    number: "869-568-4125",
    id: 10,
  },
  {
    name: "Kiki",
    number: "456-458-7452",
    id: 11,
  },
];

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<h2>Phonebook has info for ${persons.length} people</h2> <br/> <h2> ${date}</h2>`
  );
});

// fetch entire array
app.get("/", (request, response) => {
  response.json(persons);
});

// fetch single person
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });

  if (person) {
    response.send(`<h3> Name : ${person.name} </h3>
                       <h3> Phone : ${person.number} </h3> `);
  } else {
    response.status(404).json({
        error: "person not found, contact does not exist",
    });
  }
});

// generating an id
const generateId = () => {
  const id = Math.floor(Math.random() * 10000);
  const idPlus = Math.floor(Math.random() * 10000);
  return id + idPlus;
};

// save a new person to the phonebook
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // check for missing fields
  if (!body.name || !body.number) {
    response.status(400).json({
      error: "name or number missing",
    });

  }

  const names = persons.map((name) => name.name?.toLowerCase());

  // check for repeated contacts
  if (names.includes(body.name.toLowerCase())) {
    response.status(400).json({
      error: "contact already on phonebook",
    });
  }

  const person = {
    name: body.name,
    number: body.number || false,
    id: generateId(),
  };

  persons = persons.concat(person);

  app.use(morgan({format:':body', immediate: true})); // using a format string

  morgan.token('body', req => { return JSON.stringify(req.body)})

  response.json(person);
  
});



// delete a person from list
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.use(unknownEndpoint);

// const PORT = 3001;
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
