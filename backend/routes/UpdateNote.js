const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Notes');


router.put('/updatenote/:id',fetchuser, async(req,res) => {
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}
    if(!title && !description && !tag){return res.status(400).json({error: 'Please add something'})}
    let note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.json({note});
})

module.exports = router;