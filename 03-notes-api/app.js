require("dotenv").config();

const router = require("./routes/notes.js");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/notes", router);
const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=>{
    console.log(`${process.env.APP_NAME} is listening on PORT: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
})