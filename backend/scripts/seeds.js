const mongoose = require('mongoose');

require('../models/User');
require('../models/Item');
require('../models/Comment');

var Item = mongoose.model('Item');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

if (!process.env.MONGODB_URI) {
  console.warn('Missing MONGODB_URI in env, please add it to your .env file');
}

mongoose.connect(process.env.MONGODB_URI);

let userId;
let itemId;
async function saveFakeData() {
  const users = Array.from(Array(100)).map((_item, i) => ({
    username: `fakeuser${i}`,
    email: `fakeuser${i}@anythink.com`,
    bio: 'test bio',
    image: 'https://picsum.photos/200',
    role: 'user',
    favorites: [],
    following: [],
  }));

  for (let user of users) {
    const u = new User(user);

    const dbItem = await u.save();
    if (!userId) {
      userId = dbItem._id;
    }
  }

  const items = Array.from(Array(100)).map((_item, i) => ({
    slug: `fakeitem${i}`,
    title: `Fake Item ${i}`,
    description: 'test description',
    image: 'https://picsum.photos/200',
    comments: [],
    tagList: ['test', 'tag'],
    seller: userId,
  }));

  for (let item of items) {
    const it = new Item(item);

    const dbItem = await it.save();

    if (!itemId) {
      itemId = dbItem._id;
    }
  }

  const comments = Array.from(Array(100)).map((_item, i) => ({
    body: 'This is a test comment',
    seller: userId,
    item: itemId,
  }));

  for (comment of comments) {
    const c = new Comment(comment);

    await c.save();
  }
}

saveFakeData()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit();
  });