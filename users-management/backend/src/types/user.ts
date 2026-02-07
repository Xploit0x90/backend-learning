import type { ParsedQs } from "qs";

export interface User{
    id: number,
    name: string,
    age: number
}

export interface RequestBody{
    name: string,
    age: number
}

export interface ResponseBody{
    id: number,
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