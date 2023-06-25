const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../Models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1 To fetch all notes
//It utilizes the fetchuser middleware to ensure that the user is authenticated before accessing the notes.
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
//ROUTE 2 To add notes
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
//ROUTE 3 update a note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    //create a newNote object
    const newNote = {}; //issi me hi mere update hue ve chize aayengi
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find note which needs to update and then update it
    let note = await Note.findById(req.params.id);  //yaha s vo id niklegi jisse update krna hai
    //ab hum check kre h ki vo id h bi ya ni
    if (!note) { return res.status(404).send('not found') }

    //ab agr koi or isse hack krne ki koshish krra h means koi dusra update ki try krra hai
    if (note.user.toString() !== req.user.id) {
        return res.status(404).send('not allowed')
    }
    //ab hum aage aagye hai yani sab sahi hai to ab update kardo
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });

})
// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router