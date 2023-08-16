const mongoose = require("mongoose");
mongoose.set("strictQuery",false);
const url  = "mongodb+srv://quirkyexplorer:rock2own%21@cluster0.kvboml9.mongodb.net/phonebookApp?retryWrites=true&w=majority";

console.log("connecting to", url);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected to MongoDB");
})
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

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