import { ObjectId } from "mongodb";

export interface RolePermissionModel{
    id?:ObjectId |string
    _id?: string
    code?:string;
    name?:string;
    permissions:string[]
    canCreateRole?: string[]
    type:string
    canMultipleTenants: boolean
}