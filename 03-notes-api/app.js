require("dotenv").config();
const logger = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");

const router = require("./routes/notes.js");
const express = require("express");
const app = express();

app.use(express.json());
app.use(logger);
app.use("/notes", router);
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.url}`
    });
});
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=>{
    console.log(`${process.env.APP_NAME} is listening on PORT: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
})