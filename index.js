const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
app.use(cors()); // middleware that allows cross origin requests.
const Contact = require("./models/contact");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};


app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);
app.use(morgan("tiny"));
// app.use(morgan(":body", options)); // using a format string
// morgan.token("body", (res) => {
//   return JSON.stringify(res.body);
// });

let contacts = [];

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<h2>Phonebook has info for ${contacts.length} people</h2> <br/> <h2> ${date}</h2>`
  );
});

// fetch entire array
app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

// fetch single person
app.get("/api/contacts/:id", (request, response) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
        console.log(error);
        response.status(400).send({error: 'malformatted id'});
    });
});

// save a new person to the phonebook
app.post("/api/contacts", (request, response) => {
  const body = request.body;

  // check for missing fields
  if (!body.name || !body.number) {
    response.status(400).json({
      error: "name or number missing",
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number || false,
  });

  contact.save().then((savedContact) => {
    response.json(savedContact);
  });
});

// update an existing member
app.put("/api/contacts/:id", (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.content,
    number: body.important,
  };

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

// delete a contact from list
app.delete("/api/contacts/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

// const PORT = 3001;
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);
