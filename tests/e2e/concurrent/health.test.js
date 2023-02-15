const { it } = require("@jest/globals");
const { AnythinkClient } = require("../anytinkClient");

let anythinkClient;

beforeEach(async () => {
  anythinkClient = new AnythinkClient();
});

describe("Health Route", () => {
  it("Returns valid response", async () => {
    const response = await anythinkClient.healthCheck();
    expect(response?.status).toEqual(200);
  });
});
