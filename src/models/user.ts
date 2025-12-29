import { ObjectId } from "mongodb";

export interface IUser  {
  _id?:string|Object
    tenantId?: string
  email?: string;
  passwordHash?: string;
  name?: string;
  role?: string;
   permissions?: string[] ;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  
}

