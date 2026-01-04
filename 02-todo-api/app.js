const express = require("express");
const app = express();
app.use(express.json());

const todos = [
    {
        id: 1,
        title: "Clean home",
        completed: true
    },
    {
        id: 2,
        title: "Buy groceries",
        completed: true
    },
    {
        id: 3,
        title: "Go to Gym",
        completed: false
    },
]

app.get("/todos",(req,res) =>{
    res.json(todos);
})

app.get("/todos/:id", (req,res) => {
    const id = Number(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    if(todo){
        res.json(todo);
    } else {
        res.json({"message" : "TODO is not found!"});
    }
})

app.put("/todos/:id",(req,res) => {
    const id = Number(req.params.id);
    const title = req.body.title;
    const completed = req.body.completed;
    const todo = todos.find(todo=> todo.id === id)
    
    if(todo){
        todo.title = title;
        todo.completed = completed;
        res.json(todo);
    } else {
        res.json({"message": "TODO does not exist!"});
    }
})

app.post("/todos", (req,res) =>{
    const todo = {
        id: todos.length + 1,
        title: req.body.title,
        completed: false
    }

    todos.push(todo);
    res.json({"message": "Added Successfully"});
})

app.delete("/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index !== -1) {  // ← Check hinzufügen!
        todos.splice(index, 1);
        res.json({ message: "TODO deleted successfully!" });
    } else {
        res.json({ message: "TODO not found!" });
    }
});

app.listen(3002, ()=>{
    console.log("Listening on Port 3002");
})