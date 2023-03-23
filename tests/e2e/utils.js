function matchObjects(obj1, obj2) {
  if (!obj2) {
    return true;
  }
  return Object.keys(obj2).every((key) => {
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      return obj1[key].every((val) => obj2[key].includes(val));
    } else if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      return matchObjects(obj1[key], obj2[key]);
    } else {
      return obj1[key] === obj2[key];
    }
  });
}

function randomString(length = 10) {
  const result = [];
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

function randomImageUrl() {
  return `http://web.page/${randomString()}.png`;
}

function randomUserInfo(info = null) {
  const username = `user${randomString()}`;
  return {
    username: username,
    email: `${username}@test.work`,
    password: randomString(),
    ...info,
  };
}

function randomItemInfo(info = null) {
  return {
    title: randomString(),
    description: randomString(),
    image: randomImageUrl(),
    tagList: [randomString(), randomString()],
    ...info,
  };
}

module.exports = {
  randomString,
  randomImageUrl,
  randomUserInfo,
  randomItemInfo,
  matchObjects,
};
