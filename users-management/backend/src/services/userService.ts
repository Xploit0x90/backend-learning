import type { User, RequestBody } from "../types/user.js";
import { db } from "../db.js"
import {users} from "../db/schema.js"
import {eq} from "drizzle-orm";

class UserService{
    constructor(){
    }

    async getAll(): Promise<User[]> {
        return await db.select().from(users)
    }

    async getByName(name: string): Promise<User[] | undefined>{
        const foundUsers  = await db
        .select()
        .from(users)
        .where(eq(users.name, name))
        return foundUsers .length > 0 ? foundUsers  : undefined;
    }
    
    async getById(id: number): Promise<User | undefined>{
        const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id,id))
        .limit(1);

        return user
    }

    async create(name: string, age: number): Promise<User>{
        const [newUser] = await db
        .insert(users)
        .values({name, age})
        .returning();
        if (!newUser) throw new Error("Failed to create user");
        return { id: newUser.id, name: newUser.name, age: newUser.age };
    }
}

export default UserService