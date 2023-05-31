const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../Models/Note');
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {


        const notes = await Note.find({ user: req.user.id });
        //notes ko unke id se fetch karo or response me bejo
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured");

    }
})
//humne notes ko fetch to kar liya ab unko add karenge
//uske lie hum ek post request banayenge
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors return bad request
    try {


        const { title, description, tag } = req.body;
        const errors = validationResult(req);  //yaha mai errors ko manage karri hu
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error occured");
    }
})

module.exports = router