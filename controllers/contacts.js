const contactsRouter = require("express").Router();
const Contact = require("../models/contact");

// FIX ME//
// contactsRouter.get("/info", (request, response) => {
//   const date = new Date();
//   response.send(
//     `<h2>Phonebook has info for ${contacts.length} people</h2> <br/> <h2> ${date}</h2>`
//   );
// });

// fetch entire array
contactsRouter.get("/", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

contactsRouter.get("/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// save a new person to the phonebook
contactsRouter.post("/", (request, response, next) => {
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

  contact.save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch(error => next(error));
});

// FIX ME update an existing member
contactsRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: "query" })
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

// delete a contact
contactsRouter.delete("/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});



module.exports = contactsRouter;