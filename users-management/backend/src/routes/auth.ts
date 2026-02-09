import express from "express"
import type {Request, Response} from "express"
import UserController from "../controller/userController.js"

const router = express.Router()
const userController = new UserController()

router.post("/register",(req:Request,res:Response) => {
    userController.createAccount(req,res)
})

router.post("/login",(req:Request,res:Response) => {
    userController.loginAccount(req,res)
})

export default router