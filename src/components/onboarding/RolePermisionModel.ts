import { ObjectId } from "mongodb";

export interface RolePermissionModel{
    id?:ObjectId |string
    code?:string;
    name?:string;
    permissions:string[]
}