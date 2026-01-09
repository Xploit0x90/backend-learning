import express from "express";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
dotenv.config();

const server = express();
const PORT = process.env.PORT || 3003;

connectDB();
server.use(express.json());
server.use("/api/notes", notesRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});