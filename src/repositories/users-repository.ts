import { User } from "../entities/user";

export interface UsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  delete(id: number): Promise<void>; // Novo método para excluir usuário
}
