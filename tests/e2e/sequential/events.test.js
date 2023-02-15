const { describe } = require("@jest/globals");
const { AnythinkClient } = require("../anytinkClient");
const { randomItemInfo, randomUserInfo } = require("../utils");
const { execAndWaitForEvent } = require("../wilcoEngine/utils");

let anythinkClient;

beforeAll(async () => {
  anythinkClient = new AnythinkClient();
});

describe("Events to Wilco Engine", () => {
  test("Creating item sends item_created event to the Wilco Engine", async () => {
    const user = await anythinkClient.createUser(randomUserInfo());

    await execAndWaitForEvent("item_created", async () => {
      await anythinkClient.createItem(randomItemInfo(), user);
    });
  });

  test("Sends ping event to the Wilco Engine", async () => {
    await execAndWaitForEvent("ping", async () => {
      await anythinkClient.ping();
    });
  });

  test("Creating a user sends event to the Wilco Engine", async () => {
    await execAndWaitForEvent("user_created", async () => {
      await anythinkClient.createUser(randomUserInfo());
    });
  });
});
