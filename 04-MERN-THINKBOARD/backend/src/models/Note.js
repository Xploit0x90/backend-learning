import mongoose from "mongoose";
const schema = mongoose.Schema;

export const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    content: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
        trim: true,
        enum:["work","sport","personal"],
        default: "personal"
    }
},
{
    timestamps: true,
}
)

const Note = mongoose.model("Note", noteSchema);
export default Note;