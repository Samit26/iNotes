const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Notes');


router.delete('/deletenote/:id',fetchuser, async(req,res) => {
   try{ let note = await Note.findByIdAndDelete(req.params.id);
    res.json({note: 'Note has been deleted'});
   }
   catch(error){
       console.error(error.message);
       res.status(500).send('Internal Server Error');
   }
})

module.exports = router;