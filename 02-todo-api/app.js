require("dotenv").config();

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

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`${process.env.APP_NAME} listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});