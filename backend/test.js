require("dotenv").config();
const axios = require("axios");

const user = {
    user: {
        username: "puru",
        email: "puru@khedre.work",
        password: "khedre1234",
    },
};

const testItem = async () => {
  const client = axios.create({
    baseURL: `http://localhost:${process.env.PORT || 3000}`,
    timeout: 10 * 1000,
  });

  const userRes = await client.post(`/api/users`, user);

  if (!userRes.data.user) {
    console.log(`=!=!=!=!= ERROR: No user will found`);
    process.exit(1);
  }

  if (!userRes.data.user?.image) {
    console.log(`=!=!=!=!= ERROR: No image will found`);
    process.exit(1);
  }

  const regx = /^data:.+\/(.+);base64,(.*)$/;

  if (regx.test(userRes.data.user.image) === false) {
    console.log(`=!=!=!=!= ERROR: Image url is not match with base64 data url`);
    process.exit(1);
  }

  return true;
};

testItem()
  .then((res) => process.exit(res ? 0 : 1))
  .catch((e) => {
    console.log("error while checking api: " + e);
    process.exit(1);
  });
