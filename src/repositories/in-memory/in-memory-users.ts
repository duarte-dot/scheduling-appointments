import { User } from "../../entities/user";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(
      (user) => user.email === email && user.deletedAt === null
    );

    return user || null;
  }

  async getAll(): Promise<User[]> {
    return this.items; // Retorna apenas usuários ativos
  }

  async delete(id: number): Promise<void> {
    const user = this.items.find((user) => user.id === id);
    if (user) {
      user.deletedAt = new Date(); // Atualiza deletedAt
    }
  }
}
