import { IncomingMessage, ServerResponse } from "http";
import { expect, vi, describe, it } from "vitest";
import { UsersController } from "./user-controller";

describe("create an user", () => {
  it("should create a user and return 201 with the correct response", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(
            JSON.stringify({ name: "John Doe", email: "johndoe@example.com" })
          );
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to return a "user not created" error
    const mockResult = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      createdAt: new Date(),
      deletedAt: null,
    };

    const spy = vi
      .spyOn(userService, "execute")
      .mockImplementation(() => Promise.resolve(mockResult));

    // Execute the 'create' method
    await usersController.create(req, res);

    expect(
      userService.execute({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    ).resolves.toEqual(mockResult);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    // Verifications
    expect(res.statusCode).toBe(201);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    ); // Verify the header
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        message: "User created",
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
      })
    );
  });

  it("should return 400 with the correct response when the user is not created", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(
            JSON.stringify({ name: "John Doe", email: "johndoe@example.com" })
          );
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to return a "user not created" error
    const mockResult = null;

    const spy = vi
      .spyOn(userService, "execute")
      .mockImplementation(() => Promise.resolve(mockResult));

    // Execute the 'create' method
    await usersController.create(req, res);

    expect(
      userService.execute({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    ).resolves.toEqual(mockResult);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    // Verifications
    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    ); // Verify the header
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "User not created",
      })
    );
  });

  it("should return 400 with the correct response when an error occurs", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(
            JSON.stringify({ name: "John Doe", email: "johndoe@example.com" })
          );
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to throw an error
    const mockError = new Error("An error occurred");

    const spy = vi
      .spyOn(userService, "execute")
      .mockImplementation(() => Promise.reject(mockError));

    // Execute the 'create' method

    await usersController.create(req, res);

    expect(
      userService.execute({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    ).rejects.toThrowError(mockError);

    expect(spy).toHaveBeenCalled();

    // Verifications
    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    ); // Verify the header
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "An error occurred",
      })
    );
  });
});

describe("find users", () => {
  it("should return 200 with the correct response when there are users", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to return a list of users
    const mockResult = [
      {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        createdAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "janedoe@example.com",
        createdAt: new Date(),
        deletedAt: null,
      },
    ];

    const responseResult = mockResult.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    const spy = vi
      .spyOn(userService, "getAll")
      .mockImplementation(() => Promise.resolve(mockResult));

    // Execute the 'getAll' method
    await usersController.getAll(req, res);

    expect(userService.getAll()).resolves.toEqual(mockResult);
    expect(spy).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(responseResult));
  });

  it("should return 200 when the correct user is found", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to return the user
    const mockResult = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      createdAt: new Date(),
      deletedAt: null,
    };

    const responseResult = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    };

    const spy = vi
      .spyOn(userService, "findById")
      .mockImplementation(() => Promise.resolve(mockResult));

    // Execute the 'getById' method
    await usersController.getById(req, res, mockResult.id.toString());

    expect(userService.findById(mockResult.id)).resolves.toEqual(mockResult);
    expect(spy).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );

    expect(res.end).toHaveBeenCalledWith(JSON.stringify(responseResult));
  });

  it("should return 404 with the correct response when there are no users", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to return a list of users with length 0
    const mockResult = [] as never[];

    const spy = vi
      .spyOn(userService, "getAll")
      .mockImplementation(() => Promise.resolve(mockResult));

    // Execute the 'getAll' method
    await usersController.getAll(req, res);

    expect(userService.getAll()).resolves.toEqual(mockResult);
    expect(spy).toHaveBeenCalled();

    expect(res.statusCode).toBe(404);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "No users found" })
    );
  });

  it("should return 404 with the correct response when the user is not found", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to return null
    const mockResult = null;

    const spy = vi
      .spyOn(userService, "findById")
      .mockImplementation(() => Promise.resolve(mockResult));

    // Execute the 'getById' method
    await usersController.getById(req, res, "1");

    expect(userService.findById(1)).resolves.toEqual(mockResult);
    expect(spy).toHaveBeenCalled();

    expect(res.statusCode).toBe(404);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "User not found" })
    );
  });
});

describe("delete an user", () => {
  it("should delete an user by ID", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    const spy = vi
      .spyOn(userService, "delete")
      .mockImplementation(() => Promise.resolve());

    // Execute the 'delete' method
    await usersController.delete(req, res, "1");

    expect(userService.delete(1)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        message: "User with id 1 deleted successfully",
      })
    );
  });

  it("shouldn't delete an user by ID if it's out of range", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    const mockError = new Error("User not found");

    const spy = vi
      .spyOn(userService, "delete")
      .mockImplementation(() => Promise.reject(mockError));

    // Execute the 'delete' method
    await usersController.delete(req, res, "0");

    expect(userService.delete(0)).rejects.toThrowError();
    expect(spy).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "User not found" })
    );
  });

  it("shouldn't delete an user by ID if it's already deleted", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    const mockError = new Error("User already deleted");

    const spy = vi
      .spyOn(userService, "delete")
      .mockImplementation(() => Promise.reject(mockError));

    // Execute the 'delete' method
    await usersController.delete(req, res, "1");

    expect(userService.delete(1)).rejects.toThrowError(mockError);
    expect(spy).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "User already deleted" })
    );
  });

  it("should return 400 with the correct response when an error occurs", async () => {
    const usersController = new UsersController();
    const userService = usersController["userService"];

    // Mocking the request data
    const req = {
      on: vi.fn((event, callback) => {
        if (event === "data") {
          callback(JSON.stringify({}));
        }
        if (event === "end") {
          callback();
        }
      }),
    } as unknown as IncomingMessage;

    // Mocking the response
    const res = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    // Mocking the execute function of userService to throw an error
    const mockError = new Error("An error occurred");

    const spy = vi
      .spyOn(userService, "delete")
      .mockImplementation(() => Promise.reject(mockError));

    // Execute the 'delete' method
    await usersController.delete(req, res, "1");

    expect(userService.delete(1)).rejects.toThrowError(mockError);
    expect(spy).toHaveBeenCalled();

    expect(res.statusCode).toBe(400);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "An error occurred",
      })
    );
  });
});
