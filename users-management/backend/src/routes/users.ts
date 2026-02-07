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


router.get("/users",(req:Request<{},User[],RequestBody>, res:Response<User[] | ErrorResponse>)=>{ 
        userController.getAll(req,res)
})

router.get("/user", (req: Request<{}, {}, {}, UserQuery>, res: Response<User| ErrorResponse>)=> {
    userController.getByName(req, res);
})

router.get("/user/:id", (req:Request<{id: string} >, res:Response<ErrorResponse|ResponseBody>) => {
    userController.getById(req, res);
})


router.post("/users", (req: Request<{},ResponseBody,RequestBody>, res:Response<ResponseBody>)=> {
    userController.create(req,res);
})

export default router