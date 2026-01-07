const mongoose = require("mongoose");
const schema = mongoose.Schema;

const noteSchema = new schema({
        id: Number,
        title: String,
        content: String,
        category: String,
        createdAt: Date,
        updatedAt: Date
})

const NoteModel = mongoose.model("notes", noteSchema);

module.exports = NoteModel;