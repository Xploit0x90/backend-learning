import Note from "../models/Note.js";

const mongoDB = process.env.MONGODB_URI;

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find()
        res.status(200).json(notes);
    } catch(error) {
        res.status(500).json({message: error.message});
        console.log("Internal Error Server: ", error.message);
}}

export const createNote = async (req, res) => {
    try
    {   
        const {title, content, category} = req.body
        const note = new Note({title,content,category});
        const createdNote = await note.save()
        res.status(201).json({
            message: "Note created successfully",
            note: createdNote
        });
        console.log(`message: Note Created successfully\n ${createdNote}`);
    } catch(error)
    {
        console.log("Error creating a new Note", error.message);
        res.status(500).json({message: "Error creating a new Note"}, error.message);
    }
}

export const updateNote = async (req, res) => {
    try{
        const {title, content, category} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, content, category},{new:true});

        if(!updatedNote) return res.status(404).json({message: "note is not Found!"});

        res.status(200).json({message: "Note updated successfully"});
        console.log(`message: Note updated successfully\n ${updatedNote}`);

    } catch(error)
    {
        console.log("Error updating a Note", error.message);
        res.status(500).json({message: "Error updating a Note"});
    }
}

export const deleteNote = (req, res) => {
    res.status(200).send("delete a note");
}
