const express = require("express");
const todoRoutes = require("./routes/todos");
const {logger} = require("./middleware/logger.js");
const {timer} = require("./middleware/timer.js");
const {errorHandler} = require("./middleware/errorHandler.js");

const app = express();

app.use(logger);
app.use(timer);

app.use(express.json());
app.use("/todos", todoRoutes);

app.use(errorHandler);

app.listen(3002, ()=>{
    console.log("Listening on Port 3002");
})