import { User } from "../entities/user";

export interface UsersRepository {
  create(user: User): Promise<void>;
  findById(id: number): Promise<Omit<User, "props"> | null>;
  findByEmail(email: string): Promise<User | null>;
  getAll(): Promise<Omit<User, "props">[]>;
  delete(id: number): Promise<void>;
}
