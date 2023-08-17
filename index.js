const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");

// // update an existing member
// app.put("/api/contacts/:id", (request, response, next) => {
//   const { name, number } = request.body;

//   Contact.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: "query" })
//     .then((updatedContact) => {
//       response.json(updatedContact);
//     })
//     .catch((error) => next(error));
// });

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});