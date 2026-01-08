export const getAllNotes = (req, res) => {
    res.status(200).send("Get all notes");
}

export const createNote = (req, res) => {
    res.status(201).send("create a new note");
}

export const updateNote = (req, res) => {
    res.status(200).send("update a note");
}

export const deleteNote = (req, res) => {
    res.status(200).send("delete a note");
}
