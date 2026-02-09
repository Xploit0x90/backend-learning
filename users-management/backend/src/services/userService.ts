import type { User, UserWithPassword, RequestBody } from "../types/user.js";
import { db } from "../db.js"
import {users} from "../db/schema.js"
import {eq} from "drizzle-orm";

class UserService{
    async getAllUsers(): Promise<User[]> {
        return await db
            .select()
            .from(users)
    }

    async getUserByName(name: string): Promise<User[] | undefined>{
        const foundUsers  = await db
            .select()
            .from(users)
            .where(eq(users.name, name))
        return foundUsers .length > 0 ? foundUsers  : undefined;
    }
    
    async getUserById(id: number): Promise<User | undefined>{
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id,id))
            .limit(1);
        return user
    }

    async createAccount(email:string, hashedPassword:string, name: string, age: number): Promise<User>{
        const [newUser] = await db
            .insert(users)
            .values({email, password:hashedPassword ,name, age})
            .returning();
        if (!newUser) throw new Error("Failed to create user");
        return { id: newUser.id,email:newUser.email, name: newUser.name, age: newUser.age };
    }

    async deleteUser(id:number):Promise<User|undefined>{
        const [deleted] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({id:users.id,email:users.email, password:users.password, name:users.name, age:users.age})
        return deleted
    }

    async getUserByEmail(email:string):Promise<UserWithPassword|undefined>{
        const [account] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
        return account
        }
        
}

export default UserService