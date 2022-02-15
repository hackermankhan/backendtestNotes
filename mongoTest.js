const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide password as an argument: node mongo.js <password>')
    process.exit()
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackopen:${password}@fullstackopencluster.djmab.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

//define scheme
const noteScema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

//the note model is just a constructor that uses the schema
const Note = mongoose.model('Note', noteScema)

//create and example note using our note model constructor we just made
/*const note = new Note({
    content: 'Nikocado does not eat avocados',
    date: new Date(),
    important: false,
})

//save the note
note.save().then(result => {
    console.log("note saved")
    mongoose.connection.close()
})*/

//the parameter {} means all notes
//{important: true} would be only notes that are important
Note.find({}).then(result => {
    //result is an array of the notes
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})