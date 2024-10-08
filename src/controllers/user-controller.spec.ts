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
