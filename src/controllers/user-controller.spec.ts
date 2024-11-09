import request from "supertest";
import { afterEach, beforeAll, describe, it } from "vitest";
import { app } from "../app";

beforeAll(async () => {
  await app.ready();
});

afterEach(async () => {
  await request(app.server).delete("/users");
});

describe("create an user", () => {
  it("should create a user and return 201 with the correct response", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "duarte",
        email: "gabrieldvr@outlook.com",
      })
      .expect(201, {
        message: "User created",
        user: {
          name: "duarte",
          email: "gabrieldvr@outlook.com",
        },
      });
  });

  it('should return 400 with the error "invalid email" when the user sets an invalid e-mail', async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "duarte",
        email: "gabrieldvroutlook.com",
      })
      .expect(400, {
        error: "Invalid email",
      });
  });

  it('should return 400 with the error "There is already an user with this email" when there is already an user with the email chosen', async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "duarte",
        email: "gabrieldvr@outlook.com",
      })
      .expect(201, {
        message: "User created",
        user: {
          name: "duarte",
          email: "gabrieldvr@outlook.com",
        },
      })
      .then(async () => {
        await request(app.server)
          .post("/users")
          .send({
            name: "duarte",
            email: "gabrieldvr@outlook.com",
          })
          .expect(400, {
            error: "There is already an user with this email",
          });
      });
  });
});

describe("find users", () => {
  it("should return 200 with an empty array when there are no users", async () => {
    await request(app.server).get("/users").expect(200, []);
  });

  it("should return all users", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "duarte",
        email: "gabrieldvr@outlook.com",
      })
      .then(async () => {
        await request(app.server).post("/users").send({
          name: "duarte2",
          email: "gabrieldvr2@outlook.com",
        });
      })
      .then(async () => {
        await request(app.server)
          .get("/users")
          .expect([
            {
              id: 1,
              name: "duarte",
              email: "gabrieldvr@outlook.com",
            },
            {
              id: 2,
              name: "duarte2",
              email: "gabrieldvr2@outlook.com",
            },
          ]);
      });
  });

  it("should return 200 when the correct user (by ID) is found", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "user by id",
        email: "userbyid@outlook.com",
      })
      .expect(201, {
        message: "User created",
        user: {
          name: "user by id",
          email: "userbyid@outlook.com",
        },
      })
      .then(async () => {
        await request(app.server).get("/users/1").send().expect(200, {
          name: "user by id",
          email: "userbyid@outlook.com",
        });
      });
  });

  it('should return 404 with the error "User not found" when the user is not found', async () => {
    await request(app.server)
      .get("/users/1")
      .expect(404, { error: "User not found" });
  });
});

describe("delete an user", () => {
  it("should delete an user by ID", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "duarte",
        email: "gabrieldvr@outlook.com",
      })
      .then(async () => {
        await request(app.server)
          .delete("/users/1")
          .expect(202, { message: "User with id 1 deleted successfully" });
      });
  });

  it("shouldn't delete an user by ID if it's out of range", async () => {
    await request(app.server)
      .delete("/users/1")
      .expect(400, { error: "User not found" });
  });

  it("shouldn't delete an user by ID if it's already deleted", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "duarte",
        email: "gabrieldvr@outlook.com",
      })
      .then(async () => {
        await request(app.server)
          .delete("/users/1")
          .then(async () => {
            await request(app.server)
              .delete("/users/1")
              .expect(400, { error: "User already deleted" });
          });
      });
  });
});
