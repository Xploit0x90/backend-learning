import type { ParsedQs } from "qs";

export interface User{
    id: number,
    email:  string,
    name: string,
    age: number
}

/** User including password hash — use only for auth (e.g. login), never in API responses. */
export interface UserWithPassword extends User {
    password: string;
}


export interface RequestBody{
    email:string,
    password:string,
    name: string,
    age: number
}

export interface ResponseBody{
    id: number,
    email:string,
    name:string,
    age: number
}

export interface ErrorResponse{
    message: string
}

/** Query params for GET /user. Extends ParsedQs so Request<{}, {}, {}, UserQuery> is valid with exactOptionalPropertyTypes. */
export interface UserQuery extends ParsedQs {
    name?: string;
    age?: string;
}