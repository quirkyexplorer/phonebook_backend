const mongoose = require('mongoose');
mongoose.set('strictQuery',false)
const url  = `mongodb+srv://quirkyexplorer:rock2own%21@cluster0.kvboml9.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

console.log('connecting to', url)

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({  // schema
  name: String,
  number: String,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Contact', contactSchema)