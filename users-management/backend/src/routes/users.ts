import express from "express";
import type {Request, Response} from "express";
import type { User, RequestBody, ResponseBody, ErrorResponse, UserQuery } from "../types/user.js";
import UserService from "../services/userService.js"
import UserController from "../controller/userController.js"

const router = express.Router()
const userController = new UserController()

const NotFound = {message: "Not Found 404!"}
const BadRequest = {message: "Bad Request 400!"}
const ServerError = {message: "Something went wrong..."}


router.get("/", (req: Request<{}, User[], RequestBody, UserQuery>, res: Response<User[] | ErrorResponse>) => {
    if (req.query.name != null && req.query.name !== "") {
        userController.getUserByName(req, res)
    } else {
        userController.getAllUsers(req, res)
    }
})

router.get("/:id", (req:Request<{id: string} >, res:Response<ErrorResponse|ResponseBody>) => {
    userController.getUserById(req, res);
})


router.post("/", (req: Request<{},ResponseBody,RequestBody>, res:Response<ResponseBody>)=> {
    userController.createUser(req,res);
})

router.delete("/:id", (req: Request, res:Response<ResponseBody>)=> {
    userController.deleteUser(req,res);
})

export default router