const {
  beforeAll,
  expect,
  describe,
  beforeEach,
  test,
} = require("@jest/globals");
const { AnythinkClient } = require("../anytinkClient");
const {
  randomItemInfo,
  randomUserInfo,
  randomImageUrl,
  randomString,
  matchObjects,
} = require("../utils");

let anythinkClient;

beforeAll(async () => {
  anythinkClient = new AnythinkClient();
});

describe("Items Route", () => {
  describe("Create Item", () => {
    let user;

    beforeAll(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
    });

    test("Can create and retreive an item", async () => {
      const item = randomItemInfo();

      const createdItem = await anythinkClient.createItem(item, user);
      expect(matchObjects(createdItem, item)).toBe(true);

      const receivedItem = await anythinkClient.getItem(createdItem.slug);

      expect(matchObjects(receivedItem, createdItem)).toBe(true);
    });

    test("Can't create item without title", async () => {
      await expect(
        anythinkClient.createItem(randomItemInfo({ title: undefined }, user))
      ).rejects.toThrow();
    });

    test("Can't create item without description", async () => {
      await expect(
        anythinkClient.createItem(randomItemInfo({ description: undefined }))
      ).rejects.toThrow();
    });

    test("Can create item without image", async () => {
      const createdItem = await anythinkClient.createItem(
        randomItemInfo({ image: undefined }),
        user
      );
      expect(createdItem.image).toBeFalsy();
      expect(createdItem.slug).toBeDefined();
    });

    test("Can create item without tagList", async () => {
      const createdItem = await anythinkClient.createItem(
        randomItemInfo({ tagList: undefined }),
        user
      );
      expect(createdItem.tagList).toStrictEqual([]);
      expect(createdItem.slug).toBeDefined();
    });
  });

  describe("Delete item", () => {
    let user;

    beforeAll(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
    });

    test("Can delete item", async () => {
      const createdItem = await anythinkClient.createItem(
        randomItemInfo(),
        user
      );
      await anythinkClient.deleteItem(createdItem.slug, user);
      await expect(anythinkClient.getItem(createdItem.slug)).rejects.toThrow();
    });

    test("Can't delete item created by other user", async () => {
      const otherUser = await anythinkClient.createUser(randomUserInfo());
      const createdItem = await anythinkClient.createItem(
        randomItemInfo(),
        otherUser
      );

      await expect(
        anythinkClient.deleteItem(createdItem.slug, user)
      ).rejects.toThrow();
    });
  });

  describe("Update Item", () => {
    let user;

    beforeEach(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
    });

    test("Can't update item created by other user", async () => {
      const otherUser = await anythinkClient.createUser(randomUserInfo());
      const createdItem = await anythinkClient.createItem(
        randomItemInfo(),
        otherUser
      );

      await expect(
        anythinkClient.updateItem(createdItem.slug, randomItemInfo(), user)
      ).rejects.toThrow();
    });

    test("Can update title of an item", async () => {
      const updateInfo = { title: randomString() };
      await createAndValidateUpdate(updateInfo);
    });

    test("Can update description of an item", async () => {
      const updateInfo = { description: "New Description" };
      await createAndValidateUpdate(updateInfo);
    });

    test("Can update image of an item", async () => {
      const updateInfo = { image: randomImageUrl() };
      await createAndValidateUpdate(updateInfo);
    });

    test("Can update all fields of an item", async () => {
      const updateInfo = {
        title: "New Title",
        description: "New Description",
        image: randomImageUrl(),
      };

      await createAndValidateUpdate(updateInfo);
    });

    const createAndValidateUpdate = async (updateInfo) => {
      const origItemInfo = randomItemInfo();
      const item = await anythinkClient.createItem(origItemInfo, user);

      const updatedItemResult = await anythinkClient.updateItem(
        item.slug,
        updateInfo,
        user
      );
      expect(
        matchObjects(updatedItemResult, {
          ...origItemInfo,
          ...updateInfo,
        })
      ).toBe(true);

      const retreivedItem = await anythinkClient.getItem(item.slug);
      expect(matchObjects(retreivedItem, updatedItemResult)).toBe(true);
    };
  });

  describe("Favorite Item", () => {
    let user;
    let favoritingUserA;
    let favoritingUserB;

    beforeEach(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
      favoritingUserA = await anythinkClient.createUser(randomUserInfo());
      favoritingUserB = await anythinkClient.createUser(randomUserInfo());
    });

    test("Users can favorite an item", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);

      await anythinkClient.favoriteItem(item.slug, favoritingUserA);

      const itemBeforeFavoriting = await anythinkClient.getItem(item.slug);
      expect(itemBeforeFavoriting.favoritesCount).toBe(1);
      expect(itemBeforeFavoriting.favorited).toBe(false);

      await anythinkClient.favoriteItem(item.slug, favoritingUserB);
      const itemAfterFavoriting = await anythinkClient.getItem(
        item.slug,
        favoritingUserB
      );
      expect(itemAfterFavoriting.favoritesCount).toBe(2);
      expect(itemAfterFavoriting.favorited).toBe(true);
    });

    test("User can favorite multiple items", async () => {
      const itemA = await anythinkClient.createItem(randomItemInfo(), user);
      const itemB = await anythinkClient.createItem(randomItemInfo(), user);

      await anythinkClient.favoriteItem(itemA.slug, favoritingUserA);
      await anythinkClient.favoriteItem(itemB.slug, favoritingUserB);

      const updatedItemA = await anythinkClient.getItem(itemA.slug);
      expect(updatedItemA.favoritesCount).toBe(1);

      const updatedItemB = await anythinkClient.getItem(itemB.slug);
      expect(updatedItemB.favoritesCount).toBe(1);
    });

    test("Users can unfavorite an item", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);

      await anythinkClient.favoriteItem(item.slug, favoritingUserA);
      await anythinkClient.favoriteItem(item.slug, favoritingUserB);

      const itemAfterTwoFavorites = await anythinkClient.getItem(item.slug);
      expect(itemAfterTwoFavorites.favoritesCount).toBe(2);

      await anythinkClient.unfavoriteItem(item.slug, favoritingUserA);
      const itemAfterFirstUnfavorite = await anythinkClient.getItem(item.slug);
      expect(itemAfterFirstUnfavorite.favoritesCount).toBe(1);

      await anythinkClient.unfavoriteItem(item.slug, favoritingUserB);
      const itemAfterSecondUnfavorite = await anythinkClient.getItem(item.slug);
      expect(itemAfterSecondUnfavorite.favoritesCount).toBe(0);
    });

    test("Unable to favorite an item without a logged in user", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);

      await expect(anythinkClient.favoriteItem(item.slug)).rejects.toThrow();
    });

    test("Unable to unfavorite an item without a logged in user", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);

      await expect(anythinkClient.unfavoriteItem(item.slug)).rejects.toThrow();
    });
  });

  describe("Comment on Item", () => {
    let user;
    let commentingUserA;
    let commentingUserB;

    beforeEach(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
      commentingUserA = await anythinkClient.createUser(randomUserInfo());
      commentingUserB = await anythinkClient.createUser(randomUserInfo());
    });

    test("Users can comment on an item", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);
      await addComments(item, [commentingUserA, commentingUserB]);

      const itemsComments = await anythinkClient.getComments(item.slug);
      expect(itemsComments).toHaveLength(2);
    });

    test("Can't comment on an item without a logged in user", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);

      await expect(
        anythinkClient.commentOnItem(item.slug, "Comment")
      ).rejects.toThrow();
    });

    test("Comments are retreived in reversed order", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);
      const commnets = await addComments(item, [
        commentingUserA,
        commentingUserB,
      ]);

      const itemsComments = await anythinkClient.getComments(item.slug);

      expect(itemsComments[0]).toMatchObject(commnets[1]);
      expect(itemsComments[1]).toMatchObject(commnets[0]);
    });

    test("Users can delete their own comments", async () => {
      const item = await anythinkClient.createItem(randomItemInfo(), user);
      const commnets = await addComments(item, [
        commentingUserA,
        commentingUserB,
      ]);

      expect(await anythinkClient.getComments(item.slug)).toHaveLength(2);

      await anythinkClient.deleteComment(
        item.slug,
        commnets[0].id,
        commentingUserA
      );
      expect(await anythinkClient.getComments(item.slug)).toHaveLength(1);

      await anythinkClient.deleteComment(
        item.slug,
        commnets[1].id,
        commentingUserB
      );
      expect(await anythinkClient.getComments(item.slug)).toHaveLength(0);
    });

    const addComments = async (item, commentingUsers) => {
      let comments = [];

      for (const user of commentingUsers) {
        const commentBody = randomString(50);
        const comment = await anythinkClient.commentOnItem(
          item.slug,
          commentBody,
          user
        );
        comments.push(comment);
      }

      return comments;
    };
  });

  describe("Get User's feed", () => {
    let user;
    let followedUserA;
    let followedUserB;
    let unfollowedUser;

    let followedUserAItems;
    let followedUserBItems;

    beforeEach(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
      followedUserA = await anythinkClient.createUser(randomUserInfo());
      followedUserB = await anythinkClient.createUser(randomUserInfo());
      unfollowedUser = await anythinkClient.createUser(randomUserInfo());

      followedUserAItems = await createItems(followedUserA, 7);
      followedUserBItems = await createItems(followedUserB, 12);
      await createItems(unfollowedUser, 5);

      await anythinkClient.followUser(followedUserA.username, user);
      await anythinkClient.followUser(followedUserB.username, user);
    });

    test("User's feed contains only items by followed users", async () => {
      const feed = await anythinkClient.getFeed(user);
      expect(feed).toHaveLength(19);

      const followedUserItemsInFeed = feed.filter(
        (item) => item.seller.username === followedUserA.username
      );
      expect(followedUserItemsInFeed).toHaveLength(7);

      const followedUserBItemsInFeed = feed.filter(
        (item) => item.seller.username === followedUserB.username
      );

      expect(followedUserBItemsInFeed).toHaveLength(12);

      const unfollowedUserItemsInFeed = feed.filter(
        (item) => item.seller.username === unfollowedUser.username
      );
      expect(unfollowedUserItemsInFeed).toHaveLength(0);
    });

    test("Item's seller in feed always marked as followed", async () => {
      const feed = await anythinkClient.getFeed(user);
      expect(feed.every((item) => item.seller.following)).toBe(true);
    });

    test("Can limit number of returned items", async () => {
      const feed = await anythinkClient.getFeed(user, 9);
      expect(feed).toHaveLength(9);

      const feedSlugs = feed.map((item) => item.slug);
      const expectedSlugs = [
        ...followedUserAItems.slice(0, 7),
        ...followedUserBItems.slice(0, 2),
      ].map((item) => item.slug);
      expect(feedSlugs).toEqual(expectedSlugs);
    });

    test("Can offset number of returned items", async () => {
      const feed = await anythinkClient.getFeed(user, null, 5);
      expect(feed).toHaveLength(14);

      const feedSlugs = feed.map((item) => item.slug);
      const expectedSlugs = [
        ...followedUserAItems.slice(5, 7),
        ...followedUserBItems,
      ].map((item) => item.slug);
      expect(feedSlugs).toEqual(expectedSlugs);
    });

    test("Can limit and offset number of returned items", async () => {
      const feed = await anythinkClient.getFeed(user, 5, 5);
      expect(feed).toHaveLength(5);

      const feedSlugs = feed.map((item) => item.slug);
      const expectedSlugs = [
        ...followedUserAItems.slice(5, 7),
        ...followedUserBItems.slice(0, 3),
      ].map((item) => item.slug);
      expect(feedSlugs).toEqual(expectedSlugs);
    });

    test("Can't get feed without a logged in user", async () => {
      await expect(anythinkClient.getFeed()).rejects.toThrow();
    });
  });

  describe("Get User's items", () => {
    let user;
    let followedUser;
    let unfollowedUser;

    let followedUserItems;
    let unfollowedUserBItems;

    beforeEach(async () => {
      user = await anythinkClient.createUser(randomUserInfo());
      followedUser = await anythinkClient.createUser(randomUserInfo());
      unfollowedUser = await anythinkClient.createUser(randomUserInfo());

      followedUserItems = await createItems(followedUser, 12);
      unfollowedUserBItems = await createItems(unfollowedUser, 17);

      await anythinkClient.followUser(followedUser.username, user);
    });

    test("Can get followed user's items", async () => {
      const userItems = await anythinkClient.getUserItems(
        followedUser.username
      );
      expect(userItems).toMatchObject(followedUserItems.reverse());
    });

    test("Can get unfollowed user's items", async () => {
      const userItems = await anythinkClient.getUserItems(
        unfollowedUser.username
      );
      expect(userItems).toMatchObject(unfollowedUserBItems.reverse());
    });

    test("Item's seller is marked as followed if seller if followed", async () => {
      const userItems = await anythinkClient.getUserItems(
        followedUser.username,
        null,
        null,
        null,
        null,
        user
      );

      for (const item of userItems) {
        expect(item.seller.following).toBe(true);
      }
    });

    test("Item's seller is marked as not followed if seller if not followed", async () => {
      const userItems = await anythinkClient.getUserItems(
        unfollowedUser.username,
        null,
        null,
        null,
        null,
        user
      );

      for (const item of userItems) {
        expect(item.seller.following).toBe(false);
      }
    });

    test("Can limit number of returned items", async () => {
      const userItems = await anythinkClient.getUserItems(
        followedUser.username,
        4
      );
      expect(userItems).toMatchObject(followedUserItems.reverse().slice(0, 4));
    });

    test("Can offset returned items", async () => {
      const userItems = await anythinkClient.getUserItems(
        followedUser.username,
        null,
        2
      );
      expect(userItems).toMatchObject(followedUserItems.reverse().slice(2));
    });

    test("Can limit and offset returned items", async () => {
      const userItems = await anythinkClient.getUserItems(
        followedUser.username,
        3,
        2
      );
      expect(userItems).toMatchObject(followedUserItems.reverse().slice(2, 5));
    });

    test("Can get only favorited items", async () => {
      const itemsToFavorite = [
        followedUserItems[2],
        followedUserItems[5],
        followedUserItems[10],
      ];

      for (const item of itemsToFavorite) {
        await anythinkClient.favoriteItem(item.slug, user);
      }

      const favoritedItems = await anythinkClient.getUserItems(
        followedUser.username,
        null,
        null,
        user.username
      );

      expect(favoritedItems).toHaveLength(3);

      expect(favoritedItems[0].title).toBe(itemsToFavorite[2].title);
      expect(favoritedItems[1].title).toBe(itemsToFavorite[1].title);
      expect(favoritedItems[2].title).toBe(itemsToFavorite[0].title);
    });

    test("Can combine all filters", async () => {
      const itemsToFavorite = [
        followedUserItems[1],
        followedUserItems[4],
        followedUserItems[9],
      ];

      for (const item of itemsToFavorite) {
        await anythinkClient.favoriteItem(item.slug, user);
      }

      const favoritedItems = await anythinkClient.getUserItems(
        followedUser.username,
        2,
        1,
        user.username
      );

      expect(favoritedItems).toHaveLength(2);

      expect(favoritedItems[0].title).toBe(itemsToFavorite[1].title);
      expect(favoritedItems[1].title).toBe(itemsToFavorite[0].title);
    });
  });

  const createItems = async (user, count) => {
    let items = [];

    for (let i = 0; i < count; i++) {
      const item = await anythinkClient.createItem(randomItemInfo(), user);
      items.push(item);
    }

    return items;
  };
});
