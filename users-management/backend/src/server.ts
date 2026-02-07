import express from "express"
import dotenv from "dotenv"
import router from "./routes/users.js";
import {logger} from "./middleware/logger.js"
dotenv.config()

interface Env {
    PORT?: string | undefined;
}
const env: Env = { PORT: process.env.PORT };
const PORT: number = Number(env.PORT ?? 3000);

const server = express();
server.use(express.json())
server.use(logger)
server.use("/api", router)

server.listen(PORT,() => {
    console.log(`Server is connected on PORT : ${PORT}`)
})

