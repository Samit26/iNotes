const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Notes');

router.post('/createnotes', fetchuser, async (req, res) => {
  console.log('Hello World');
  try {
    const { title, description, tag } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Please add a title' });
    }
    const note = new Note({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;