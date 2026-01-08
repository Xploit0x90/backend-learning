import express from "express";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
dotenv.config();

const server = express();

server.use("/api/notes", notesRoutes);

server.listen(process.env.PORT, () => {
    console.log("Server is running on port 3003");
});