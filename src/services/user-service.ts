import { User } from "../entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface UserServiceRequest {
  name: string;
  email: string;
}

type UserServiceResponse = Omit<User, "props"> | null;

export class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
  }: UserServiceRequest): Promise<UserServiceResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists && emailAlreadyExists.deletedAt === null) {
      throw new Error("There is already an user with this email");
    }

    // Gera um ID sequencial
    const userCount = await this.usersRepository.getAll();
    const userId =
      userCount.length > 0 ? userCount[userCount.length - 1].id + 1 : 1; // Gera um novo ID

    const user = new User({
      id: userId,
      name,
      email,
      createdAt: new Date(),
      deletedAt: null,
    });

    await this.usersRepository.create(user);

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async getAll(): Promise<User[]> {
    return this.usersRepository.getAll();
  }

  async delete(id: number): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
  }
}
