const express = require('express');
const connectToDb = require('./db');
const userdb = require('./routes/Authentication');
const fetchingNotes = require('./routes/FetchNotes');
const creatingNotes = require('./routes/CreateNote');

connectToDb();
const app = express();
const port = 3000;

app.use(express.json());


app.get('/', (req,res) => {
    res.send('Hello World');
})

app.use(userdb)
app.use(creatingNotes);
app.use(fetchingNotes);


app.listen(port , () => {
    console.log('Server started at port 3000')
})