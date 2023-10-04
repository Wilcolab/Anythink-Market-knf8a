import { expect, test } from "@playwright/test";

import {
  dispatch,
  listenAndTriggerRequest,
  wrapWithRequestId,
} from "../requestValidator";
import { uid } from "uid";

const username = `user${(Math.random() + 1).toString(36).substring(7)}`;
const email = `${username}@email.com`;
const password = `pass${(Math.random() + 1).toString(36).substring(7)}`;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZWE2MjAxZjg3MjE1OGMzMTE1YWI0ZSIsInVzZXJuYW1lIjoidXNlcjJ3d3FlIiwiZXhwIjoxNjgxNDg1Mjk3LCJpYXQiOjE2NzYzMDQ4OTd9.Z45FqelGgXLU4q6xkhw_fTHZ5GXoVsx0vI_HoI3ccDo";

const wrapExpectCreateUser = (page, username, email, password) => {
  return wrapWithRequestId((requestId) => {
    page.on("request", (request) => {
      if (
        request.url() === `${process.env.BACKEND_API_URL}/users` &&
        request.method() === "POST"
      ) {
        expect(JSON.parse(request.postData())?.user?.username).toEqual(
          username
        );
        expect(JSON.parse(request.postData())?.user?.email).toEqual(email);
        expect(JSON.parse(request.postData())?.user?.password).toEqual(
          password
        );
        dispatch(requestId);
      }
    });
  })();
};

test.beforeEach(async ({ page }) => {
  await page.route(`${process.env.BACKEND_API_URL}/users`, async (route) => {
    const json = {
      user: {
        username: username,
        email: email,
        token: token,
        role: "user",
      },
    };
    await route.fulfill({ json, contentType: "application/json", status: 200 });
  });

  await page.route(
    `${process.env.BACKEND_API_URL}/profiles/${username}`,
    async (route) => {
      const json = {
        profile: {
          username: username,
          image: "https://static.productionready.io/images/smiley-cyrus.jpg",
          following: false,
        },
      };
      await route.fulfill({
        json,
        headers: { "Content-Type": "application/json" },
      });
    }
  );

  await page.route(
    `${process.env.BACKEND_API_URL}/items?seller=${username}**`,
    async (route) => {
      const json = { items: [], itemsCount: 0 };
      await route.fulfill({
        json,
        headers: { "Content-Type": "application/json" },
      });
    }
  );
});

test("User creation redirects to profile page ", async ({ page }) => {
  await page.goto(`${process.env.REACT_APP_URL}`);
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByPlaceholder("Email").fill(email);
  await page.getByRole("button", { name: "SIGN UP" }).click();
  await page.waitForSelector(`[href="/@${username}"]`);
  expect(page.url()).toBe(`${process.env.REACT_APP_URL}/@${username}`);
});

test("Creating a user triggers a request", async ({ page }) => {
  await page.goto(`${process.env.REACT_APP_URL}`);
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByPlaceholder("Email").fill(email);
  await listenAndTriggerRequest(
    async () => wrapExpectCreateUser(page, username, email, password),
    async () => await page.getByRole("button", { name: "SIGN UP" }).click()
  );
});
