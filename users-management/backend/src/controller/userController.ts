import UserService from "../services/userService.js"
import type {Request, Response, NextFunction} from "express";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async createUser(req:Request, res:Response){
        try{
        const {name, age} = req.body
        const newUser = await this.userService.createUser(name, Number(age))
        res.status(201).json(newUser)}
        catch(error){
            res.status(400).json({success: false, error: error})
        }
    }

    async getAllUsers(req:Request, res:Response){
        try{
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users ?? [])

        }catch(error){
            return res.status(500).json({success:false, error : error})
        }
    }

    async getUserById(req:Request, res:Response){
        try{
            const id = req.params.id
            const user = await this.userService.getUserById(Number(id))
            if(!user){
                return res.status(404).json({success:false, message: "Not user found"})
            }
            return res.status(200).json(user)
        }
        catch(error){
            return res.status(500).json({success: false, message:"Server error"})
        }
    }

    async getUserByName(req:Request, res:Response){
        try{
            const name = req.query.name;
            const nameStr = typeof name === "string" ? name : undefined;
            if (nameStr === undefined) {
                return res.status(400).json({ success: false, message: "Query parameter 'name' is required" });
            }
            const users = await this.userService.getUserByName(nameStr);
            return res.status(200).json(users ?? [])
        }catch(error){
            return res.status(500).json({success: false, message:"Server error"})
        }
    }

    async deleteUser(req:Request, res:Response){
        try{
            const id = Number(req.params.id);
            if (!id) {
                return res.status(400).json({ success: false, message: "user id required" });
            }
            const user = await this.userService.deleteUser(id);
            if(!user){
                return res.status(404).json({success:false, message: "No user found"})
            }
            return res.status(200).json({user,message:`user deleted successfully`})
        }catch(error){
            return res.status(500).json({success: false, message:"Server error"})
        }
    }
}

export default UserController

