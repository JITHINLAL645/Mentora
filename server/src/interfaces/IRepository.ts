// interfaces/IRepository.ts
import { FilterQuery } from "mongoose";

export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  insertMany(items: Partial<T>[]): Promise<T[]>;
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  updateById(id: string, data: Partial<T>): Promise<T | null>;
  deleteById(id: string): Promise<T | null>;
}
