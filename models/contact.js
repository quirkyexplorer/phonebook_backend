const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({  // schema
  name: {
    type: String,
    maxLenght: 20,
    minLength: 3,
    required: true
  },
  number: {
    type: String,

    validate: {
      validator: function(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, "user phone number required"]

  }
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Contact", contactSchema);