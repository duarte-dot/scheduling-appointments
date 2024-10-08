import { User } from "../../entities/user";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = this.items.find((user) => user.id === id);

    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);

    return user || null;
  }

  async getAll(): Promise<User[]> {
    return this.items;
  }

  async delete(id: number): Promise<void> {
    const user = this.items.find((user) => user.id === id);

    if (user && user.deletedAt !== null) {
      throw new Error("User already deleted");
    } else if (user && user.deletedAt === null) {
      user.deletedAt = new Date(); // Atualiza deletedAt
    } else {
      throw new Error("User not found");
    }
  }
}
