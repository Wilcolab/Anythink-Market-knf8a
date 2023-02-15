const { AnythinkClient } = require("../anytinkClient");
const { randomString, randomItemInfo, randomUserInfo } = require("../utils");

let anythinkClient;

beforeEach(async () => {
  anythinkClient = new AnythinkClient();
});

describe("Tags Route", () => {
  const tags = [randomString(), randomString(), randomString()];

  let user;

  beforeEach(async () => {
    user = await anythinkClient.createUser(randomUserInfo());
  });

  test("Returned tags list contains tags for added items", async () => {
    const numItemsForTag = 3;
    for (const tag of tags) {
      for (let i = 0; i < numItemsForTag; i++) {
        await anythinkClient.createItem(
          randomItemInfo({ tagList: [tag] }),
          user
        );
      }
    }

    const returnedTags = await anythinkClient.getTags();

    for (const tag of tags) {
      expect(returnedTags).toContain(tag);
    }
  });
});
