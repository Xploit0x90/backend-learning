const express = require("express"); // import Express
const app = express(); // create Server
app.use(express.json()); // To read body

// Array with Objects
const books = [
    { id: 1, title: "Harry Potter", author: "J.K. Rowling", year: 1997 },
    { id: 2, title: "Der Herr der Ringe", author: "Tolkien", year: 1954 },
    { id: 3, title: "Der Herr der Ringe", author: "Tolkien", year: 1954 },
    { id: 4, title: "1984", author: "George Orwell", year: 1949 },
];

// Get request
app.get("/books",(req,res) => {
    res.json(books);
})

app.get("/search", (req,res) =>{
    // Query Data
    const author = req.query.author;
    // filter and return Array 
    const foundBooks = books.filter(book=>book.author === author);
    if(foundBooks.length > 0){
        res.json(foundBooks)
    }else{
        res.json({message : "No Books Found for this Author"})
    }
})

// POST request, add a book
app.post("/add", (req,res) => {
    // create a new object
    const newBook = {
        id: books.length + 1,
        title : req.body.title,
        author : req.body.author,
        year : req.body.year,
    };
    // push to an array
    books.push(newBook);
    res.json({message: "Book added Successfully"});
})

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/views/index.html");
})

// listen on Port 3001 and display a message on terminal
app.listen(3001, () => {
    console.log("I am listening in port 3001")
})