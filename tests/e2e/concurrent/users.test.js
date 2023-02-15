require("dotenv").config();
const { test, describe, beforeEach, expect } = require("@jest/globals");
const { AnythinkClient } = require("../anytinkClient");
const { randomUserInfo, randomString, randomImageUrl } = require("../utils");
const { pick } = require("lodash");

let anythinkClient;

beforeEach(async () => {
  anythinkClient = new AnythinkClient();
});

describe("Users Route", () => {
  describe("Create User", () => {
    test("Can create user with info", async () => {
      const user = randomUserInfo();
      const createdUser = await anythinkClient.createUser(user);
      expect(createdUser).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
        })
      );
    });

    test("Can retreive created user", async () => {
      const user = randomUserInfo();
      const createdUser = await anythinkClient.createUser(user);

      const retreivedUser = await anythinkClient.getUser(createdUser);

      expect(retreivedUser.email).toEqual(user.email);
    });

    test("can't create user without username", async () => {
      const user = randomUserInfo();
      delete user.username;
      await expect(anythinkClient.createUser(user)).rejects.toThrow();
    });

    test("can't create user without email", async () => {
      const user = randomUserInfo();
      delete user.email;
      await expect(anythinkClient.createUser(user)).rejects.toThrow();
    });

    test("can't create user without password", async () => {
      const user = randomUserInfo();
      delete user.password;
      await expect(anythinkClient.createUser(user)).rejects.toThrow();
    });
  });

  describe("Login User", () => {
    let user;
    let password;
    beforeEach(async () => {
      password = randomString();
      user = await anythinkClient.createUser(randomUserInfo({ password }));
    });

    test("Login generates valid token", async () => {
      const loggedInUser = await anythinkClient.loginUser(user.email, password);

      expect(loggedInUser.token).toBeDefined();

      const retreivedUser = await anythinkClient.getUser(loggedInUser);

      expect(retreivedUser.email).toEqual(user.email);
    });

    test("Receives error when trying to login with wrong password", async () => {
      await expect(
        anythinkClient.loginUser(user.email, randomString())
      ).rejects.toThrow();
    });

    test("Receives error when trying to login with missing email", async () => {
      await expect(anythinkClient.loginUser(null, password)).rejects.toThrow();
    });
  });

  describe("Update User", () => {
    let user;
    beforeEach(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
    });

    test("Can update user's username", async () => {
      const newUsername = `user${randomString()}`;
      await updateUserAndValidate({ username: newUsername });
    });

    test("Can update user's email", async () => {
      const newEmail = `${randomString()}@test.work`;
      await updateUserAndValidate({ email: newEmail });
    });

    test("Can update user's bio", async () => {
      const newBio = randomString(200);
      await updateUserAndValidate({ bio: newBio });
    });

    test("Can update user's image", async () => {
      const newImage = randomImageUrl();
      await updateUserAndValidate({ image: newImage });
    });

    test("can update all user's info", async () => {
      const newUsername = `user${randomString()}`;
      const newEmail = `${randomString()}@test.work`;
      const newBio = randomString(200);
      const newImage = randomImageUrl();

      await updateUserAndValidate({
        username: newUsername,
        email: newEmail,
        bio: newBio,
        image: newImage,
      });
    });

    test("can update user's password", async () => {
      const newPassword = randomString();

      await anythinkClient.updateUser({ password: newPassword }, user);
      const loggedInUser = await anythinkClient.loginUser(
        user.email,
        newPassword
      );
      expect(loggedInUser.token).toBeDefined();
    });

    const updateUserAndValidate = async (info) => {
      const updateUserResult = await anythinkClient.updateUser(info, user);

      expect(updateUserResult).toEqual(
        expect.objectContaining({
          username: user.username,
          email: user.email,
          ...info,
        })
      );

      const retreivedUser = await anythinkClient.getUser(updateUserResult);
      const keysToCompare = ["username", "email", ...Object.keys(info)];
      expect(pick(retreivedUser, keysToCompare)).toEqual(
        pick(updateUserResult, keysToCompare)
      );
    };
  });
});
