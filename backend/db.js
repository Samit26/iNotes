const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/iNotes'

const connectToDb = async() => {
    const data = await mongoose.connect(URI);
    console.log('Successfully Connect to DB')
}

module.exports = connectToDb;