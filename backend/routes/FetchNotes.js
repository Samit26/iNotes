const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Notes');


router.get('/fetchnotes',fetchuser, async(req,res) => {
    const notes = await Note.find({user: req.user.id});
    res.json(notes);

})

module.exports = router;