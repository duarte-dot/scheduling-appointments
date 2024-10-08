import { describe, expect, it } from "vitest";
import { User } from "./user";

describe("create an user", () => {
  it("should create an user", () => {
    const user = new User({
      id: 1,
      name: "John Doe",
      email: "john.doe@gmail.com",
      createdAt: new Date(),
    });

    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@gmail.com");
  });

  it("should not create an user without a name", () => {
    expect(() => {
      new User({
        id: 1,
        name: "",
        email: "john.doe@gmail.com",
        createdAt: new Date(),
      });
    }).toThrowError(new Error("Name cannot be empty!"));

    expect(() => {
      new User({
        id: 1,
        name: " ",
        email: "john.doe@gmail.com",
        createdAt: new Date(),
      });
    }).toThrowError(new Error("Name cannot be empty!"));
  });

  it("should not create an user without an email", () => {
    expect(() => {
      new User({
        id: 1,
        name: "John Doe",
        email: "",
        createdAt: new Date(),
      });
    }).toThrowError(new Error("Email is required"));

    expect(() => {
      new User({
        id: 1,
        name: "John Doe",
        email: " ",
        createdAt: new Date(),
      });
    }).toThrowError(new Error("Email is required"));
  });

  it("should not create an user with the name containing less than 3 characters", () => {
    expect(() => {
      new User({
        id: 1,
        name: "Jo",
        email: "john.doe@gmail.com",
        createdAt: new Date(),
      });
    }).toThrowError(new Error("Name must contain at least 3 characters"));
  });

  it("should not create an user with an invalid email", () => {
    expect(() => {
      new User({
        id: 1,
        name: "John Doe",
        email: "john.doe",
        createdAt: new Date(),
      });
    }).toThrowError(new Error("Invalid email"));
  });
});
