const express = require("express");
const router = express.Router();
const notes = require("../data/notes.js")

router.get("/",(req,res)=>{
    res.json(notes);
})

router.get("/:id",(req,res)=>{
    const id = Number(req.params.id);
    const note = notes.find(note=>note.id===id);
    if(note){
        res.json(note);
        return;
    }
    res.status(404).json({ message: "Note not found" });
})

router.post("/", (req,res) => {
    const timestamp = new Date().toISOString();
    const note = {
        id: notes.length + 1,
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        createdAt: timestamp,
        updatedAt: timestamp,
    }
    notes.push(note);
    res.status(201).json({"message": "Note added Successfully"});
})

router.put("/:id", (req,res) => {
    const id = Number(req.params.id);
    const index = notes.findIndex(note=>note.id===id);
    if(notes[index]){
        const timestamp = new Date().toISOString();
        if(req.body.title !== undefined){
            notes[index].title = req.body.title;
        }
        if(req.body.content !== undefined){
            notes[index].content = req.body.content;
        }
        if(req.body.category !== undefined){
            notes[index].category = req.body.category;
        }

        notes[index].updatedAt = timestamp;
        res.status(200).json({"message": "Note updated Successfully"});
        return;
    }
    res.status(404).json({"message": "Note not found"});
})

router.delete("/:id", (req,res) => {
    const id = Number(req.params.id);
    const index = notes.findIndex(note=>note.id===id);
    if(index !== -1){
        notes.splice(index, 1)
        res.status(200).json({ message: "Note deleted successfully!" });
    } else {
        res.status(404).json({ message: "Note not found!" });
    }
})

module.exports = router;