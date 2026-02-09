import express from "express"
import dotenv from "dotenv"
import userRouter from "./routes/users.js"
import projectRouter from "./routes/projects.js"
import taskRouter from "./routes/tasks.js"
import authRouter from "./routes/auth.js"
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

const posts = [
    {
        username: "Jim",
        title: "title1"
    },
    {
        username: "lokas",
        title: "title2"
    }
]

server.use("/api/users", userRouter)
server.use("/api/projects", projectRouter)
server.use("/api/tasks", taskRouter)
server.use("/api/auth", authRouter)


server.listen(PORT, () => {
    console.log(`Server is connected on PORT : ${PORT}`)
})