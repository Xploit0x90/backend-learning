const express = require("express");
const todos = require("../data/todos.js")
const router = express.Router();
const {validateTitle} = require("../validators.js")

router.get("/",(req,res) =>{
    res.status(200).json(todos);
})

router.get("/:id", (req,res) => {
    const id = Number(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    if(todo){
        res.status(200).json(todo);
    } else {
        throw new Error("Todo not found");
    }
})

router.put("/:id",(req,res) => {
    const id = Number(req.params.id);
    const title = req.body.title;
    const completed = req.body.completed;
    const todo = todos.find(todo=> todo.id === id)
    
    if(todo){
        if(title !== undefined) todo.title = title.trim();
        if(completed !== undefined) todo.completed = completed;
        res.status(200).json(todo);
    } else {
        res.status(404).json({"message": "TODO does not exist!"});
        
    }
})

router.post("/", (req,res) =>{
    if(!validateTitle(req.body.title)){
        res.status(400).json({"message": "Error"});
        return;
    }
    const todo = {
        id: todos.length + 1,
        title: req.body.title.trim(),
        completed: false
    }
    todos.push(todo);
    res.status(201).json({"message": "Created"});
    }
)

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index !== -1) {  // ← Check hinzufügen!
        todos.splice(index, 1);
        res.status(200).json({ message: "TODO deleted successfully!" });
    } else {
        res.status(404).json({ message: "TODO not found!" });
    }
});

module.exports = router;