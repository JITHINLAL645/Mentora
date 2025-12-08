import { IUser } from "../models/user";
import { UpdateWriteOpResult } from "mongoose";

export interface IUserModel {
  create(data: Partial<IUser>): Promise<IUser>;
  findOne(filter: object): Promise<IUser | null>;
  updateOne(filter: object, update: object): Promise<UpdateWriteOpResult>;
  findById(id: string): Promise<IUser | null>;
  countDocuments(filter?: object): Promise<number>;
  find(filter?: object): any;
}
