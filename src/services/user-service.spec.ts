import { describe, expect, it } from "vitest";
import { User } from "../entities/user";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users";
import { UserService } from "./user-service";

describe("create an user", () => {
  it("should create an user", () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    userService
      .execute({
        name: "John Doe",
        email: "john.doe@gmail.com",
      })
      .then((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.name).toBe("John Doe");
        expect(user.email).toBe("john.doe@gmail.com");
      });
  });

  it("should not create an user with an email that already exists", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    expect(
      userService.execute({
        name: "Jane Doe",
        email: "john.doe@gmail.com",
      })
    ).rejects.toThrowError(
      new Error("There is already an user with this email")
    );
  });

  it("should not create an user with an ID that already exists, even if it was deleted", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    userService
      .execute({
        name: "Jane Doe",
        email: "jane.doe@gmail.com",
      })
      .then((user) => {
        expect(user.id).toBe(2);
        expect(user.id).not.toBe(1);

        userService.delete(1).then(() => {
          userService
            .execute({
              name: "Jane Doe",
              email: "john.doe@gmail.com",
            })
            .then((user) => {
              expect(user.id).not.toBe(1);
              expect(user.id).not.toBe(2);
              expect(user.id).toBe(3);
            });
        });
      });
  });
});
