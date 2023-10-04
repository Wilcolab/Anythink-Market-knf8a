import { expect, test } from "@playwright/test";

import {
  dispatch,
  listenAndTriggerRequest,
  wrapWithRequestId,
} from "../requestValidator";

const title = "title";
const description = "description";
const imageUrl =
  "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";

const item = {
  item: {
    slug: `xxxxx-${title}`,
    title: title,
    description: description,
    image: imageUrl,
    createdAt: "2023-02-21T19:33:06.752Z",
    updatedAt: "2023-02-21T19:33:06.752Z",
    tagList: [],
    favorited: false,
    favoritesCount: 0,
    seller: {
      username: "username",
      image: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
  },
};
const wrapExpectCreateItem = (page, title, description, image) => {
  return wrapWithRequestId((requestId) => {
    page.on("request", (request) => {
      if (
        request.url() === `${process.env.BACKEND_API_URL}/items` &&
        request.method() === "POST"
      ) {
        expect(JSON.parse(request.postData())?.item?.title).toEqual(title);
        expect(JSON.parse(request.postData())?.item?.description).toEqual(
          description
        );
        expect(JSON.parse(request.postData())?.item?.image).toEqual(image);
        dispatch(requestId);
      }
    });
  })();
};

test.beforeEach(async ({ page }) => {
  await page.route(`${process.env.BACKEND_API_URL}/items`, async (route) => {
    const json = item;
    await route.fulfill({ json, contentType: "application/json", status: 200 });
  });
});

test("Creating an item trigger a request", async ({ page }) => {
  const title = "title";
  const description = "description";
  const imageUrl =
    "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
  await page.goto(`${process.env.REACT_APP_URL}/editor`);
  await page.getByPlaceholder("Item Title").fill(title);
  await page.getByPlaceholder("What's this item about?").fill(description);
  await page.getByPlaceholder("Image url").fill(imageUrl);
  await listenAndTriggerRequest(
    async () => wrapExpectCreateItem(page, title, description, imageUrl),
    async () => await page.getByRole("button", { name: "Publish Item" }).click()
  );
});

test("Creating an item redirects to the item page", async ({ page }) => {
  await page.goto(`${process.env.REACT_APP_URL}/editor`);
  await page.getByPlaceholder("Item Title").fill(title);
  await page.getByPlaceholder("What's this item about?").fill(description);
  await page.getByPlaceholder("Image url").fill(imageUrl);
  await page.getByRole("button", { name: "Publish Item" }).click();
  await page.waitForURL(`${process.env.REACT_APP_URL}/item/*`);
  expect(page.url()).toEqual(
    `${process.env.REACT_APP_URL}/item/${item.item.slug}`
  );
});
