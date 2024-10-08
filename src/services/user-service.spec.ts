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
        expect(user!.name).toBe("John Doe");
        expect(user!.email).toBe("john.doe@gmail.com");
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
        expect(user!.id).toBe(2);
        expect(user!.id).not.toBe(1);

        userService.delete(1).then(() => {
          userService
            .execute({
              name: "john",
              email: "john.doe@gmail.com",
            })
            .then((user) => {
              expect(user!.id).not.toBe(1);
              expect(user!.id).not.toBe(2);
              expect(user!.id).toBe(3);
            });
        });
      });
  });
});

describe("find an user", () => {
  it("should find an user by ID, even if it's deleted", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    userService.findById(1).then((user) => {
      expect(user).toBeInstanceOf(User);
      expect(user!.id).toBe(1);
      expect(user!.name).toBe("John Doe");
      expect(user!.email).toBe("john.doe@gmail.com");

      expect(user!.id).not.toBe(2);
      expect(user!.name).not.toBe("Jane Doe");
      expect(user!.email).not.toBe("jane.doe@gmail.com");

      userService.delete(1).then(() => {
        userService.findById(1).then((user) => {
          expect(user).toBeInstanceOf(User);
          expect(user!.id).toBe(1);
          expect(user!.name).toBe("John Doe");
          expect(user!.email).toBe("john.doe@gmail.com");

          expect(user!.id).not.toBe(2);
          expect(user!.name).not.toBe("Jane Doe");
          expect(user!.email).not.toBe("jane.doe@gmail.com");

          expect(user!.deletedAt).not.toBe(null);
        });
      });
    });

    userService.findById(2).then((user) => {
      expect(user).toBeInstanceOf(User);
      expect(user!.id).toBe(2);
      expect(user!.name).toBe("Jane Doe");
      expect(user!.email).toBe("jane.doe@gmail.com");

      expect(user!.id).not.toBe(1);
      expect(user!.name).not.toBe("John Doe");
      expect(user!.email).not.toBe("john.doe@gmail.com");

      userService.delete(2).then(() => {
        userService.findById(2).then((user) => {
          expect(user!.deletedAt).not.toBe(null);
        });
      });
    });
  });

  it("shouldn't find an user by ID if it's out of range", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    userService.findById(3).then((user) => {
      expect(user).toBe(null);
    });
  });

  it("should find an user by email, even if it's deleted", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    userService.findByEmail("john.doe@gmail.com").then((user) => {
      expect(user).toBeInstanceOf(User);
      expect(user!.id).toBe(1);
      expect(user!.name).toBe("John Doe");
      expect(user!.email).toBe("john.doe@gmail.com");

      expect(user!.id).not.toBe(2);
      expect(user!.name).not.toBe("Jane Doe");
      expect(user!.email).not.toBe("jane.doe@gmail.com");
    });

    userService.findByEmail("jane.doe@gmail.com").then((user) => {
      expect(user).toBeInstanceOf(User);
      expect(user!.id).toBe(2);
      expect(user!.name).toBe("Jane Doe");
      expect(user!.email).toBe("jane.doe@gmail.com");

      expect(user!.id).not.toBe(1);
      expect(user!.name).not.toBe("John Doe");
      expect(user!.email).not.toBe("john.doe@gmail.com");
    });

    userService.delete(1).then(() => {
      userService.findByEmail("john.doe@gmail.com").then((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user!.id).toBe(1);
        expect(user!.name).toBe("John Doe");
        expect(user!.email).toBe("john.doe@gmail.com");

        expect(user!.id).not.toBe(2);
        expect(user!.name).not.toBe("Jane Doe");
        expect(user!.email).not.toBe("jane.doe@gmail.com");

        expect(user!.deletedAt).not.toBe(null);
      });
    });

    userService.delete(2).then(() => {
      userService.findByEmail("jane.doe@gmail.com").then((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user!.id).toBe(2);
        expect(user!.name).toBe("Jane Doe");
        expect(user!.email).toBe("jane.doe@gmail.com");

        expect(user!.id).not.toBe(1);
        expect(user!.name).not.toBe("John Doe");
        expect(user!.email).not.toBe("john.doe@gmail.com");

        expect(user!.deletedAt).not.toBe(null);
      });
    });
  });

  it("shouldn't find an user by email if it doesn't exists", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    userService.findByEmail("john.doe@gmail.com").then((user) => {
      expect(user).not.toBe(null);
    });
    userService.findByEmail("jane.doe@gmail.com").then((user) => {
      expect(user).not.toBe(null);
    });
    userService.findByEmail("www.doe@gmail.com").then((user) => {
      expect(user).toBe(null);
    });
  });
});

describe("delete an user", () => {
  it("should delete an user by ID", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    userService.delete(1).then(() => {
      userService.findById(1).then((user) => {
        expect(user!.deletedAt).not.toBe(null);
      });
    });
  });

  it("shouldn't delete an user by ID if it's out of range", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    expect(userService.delete(3)).rejects.toThrowError(
      new Error("User not found")
    );
  });

  it("shouldn't delete an user by ID if it's already deleted", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const userService = new UserService(usersRepository);

    await userService.execute({
      name: "John Doe",
      email: "john.doe@gmail.com",
    });

    await userService.execute({
      name: "Jane Doe",
      email: "jane.doe@gmail.com",
    });

    userService.delete(1).then(() => {
      expect(userService.delete(1)).rejects.toThrowError(
        new Error("User already deleted")
      );
    });
  });
});
