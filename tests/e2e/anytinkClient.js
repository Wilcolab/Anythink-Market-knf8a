const axios = require("axios");

const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

class AnythinkClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3000",
      timeout: 10000,
    });
  }

  async #apiCall({ method = Method.GET, url, callingUser, data = null }) {
    const headers = callingUser
      ? { Authorization: `Token ${callingUser.token}` }
      : {};

    return this.client.request({
      method,
      url,
      data,
      headers,
    });
  }

  async healthCheck() {
    return await this.#apiCall({ url: "/health" });
  }

  async ping() {
    return await this.#apiCall({ url: "/api/ping" });
  }

  async createUser(user) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: "/api/users",
      data: { user },
    });
    return result.data?.user;
  }

  async loginUser(email, password) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: "/api/users/login",
      data: { user: { email, password } },
    });
    return result.data?.user;
  }

  async getUser(callingUser) {
    const result = await this.#apiCall({ url: "/api/user", callingUser });
    return result.data?.user;
  }

  async updateUser(userInfo, callingUser) {
    const result = await this.#apiCall({
      method: Method.PUT,
      url: "/api/user",
      callingUser,
      data: { user: userInfo },
    });
    return result.data?.user;
  }

  async createItem(item, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: "/api/items",
      callingUser,
      data: { item },
    });
    return result.data?.item;
  }

  async deleteItem(slug, callingUser) {
    await this.#apiCall({
      method: Method.DELETE,
      url: `/api/items/${slug}`,
      callingUser,
    });
  }

  async updateItem(slug, item, callingUser) {
    const result = await this.#apiCall({
      method: Method.PUT,
      url: `/api/items/${slug}`,
      callingUser,
      data: { item },
    });
    return result.data?.item;
  }

  async getItem(slug, callingUser) {
    const result = await this.#apiCall({
      url: `/api/items/${slug}`,
      callingUser,
    });
    return result.data?.item;
  }

  async favoriteItem(slug, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: `/api/items/${slug}/favorite`,
      callingUser,
    });
    return result.data?.item;
  }

  async unfavoriteItem(slug, callingUser) {
    const result = await this.#apiCall({
      method: Method.DELETE,
      url: `/api/items/${slug}/favorite`,
      callingUser,
    });
    return result.data?.item;
  }

  async commentOnItem(slug, commentBody, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: `/api/items/${slug}/comments`,
      callingUser,
      data: { comment: { body: commentBody } },
    });
    return result.data?.comment;
  }

  async deleteComment(slug, commentId, callingUser) {
    await this.#apiCall({
      method: Method.DELETE,
      url: `/api/items/${slug}/comments/${commentId}`,
      callingUser,
    });
  }

  async getComments(slug) {
    const result = await this.#apiCall({ url: `/api/items/${slug}/comments` });
    return result.data?.comments;
  }

  async getUserItems(seller, limit, offset, favorited, tag, callingUser) {
    let url = `/api/items?seller=${seller}`;

    if (limit) {
      url += `&limit=${limit}`;
    }

    if (offset) {
      url += `&offset=${offset}`;
    }

    if (favorited) {
      url += `&favorited=${favorited}`;
    }

    if (tag) {
      url += `&tag=${tag}`;
    }

    const result = await this.#apiCall({ url, callingUser });
    return result.data?.items;
  }

  async getFeed(callingUser, limit, offset) {
    let url = "/api/items/feed?";

    if (limit) {
      url += `&limit=${limit}`;
    }

    if (offset) {
      url += `&offset=${offset}`;
    }

    const result = await this.#apiCall({ url, callingUser });
    return result.data?.items;
  }

  async followUser(username, callingUser) {
    const result = await this.#apiCall({
      method: Method.POST,
      url: `/api/profiles/${username}/follow`,
      callingUser,
    });
    return result.data?.profile;
  }

  async unfollowUser(username, callingUser) {
    const result = await this.#apiCall({
      method: Method.DELETE,
      url: `/api/profiles/${username}/follow`,
      callingUser,
    });
    return result.data?.profile;
  }

  async getProfile(username, callingUser) {
    const result = await this.#apiCall({
      url: `/api/profiles/${username}`,
      callingUser,
    });
    return result.data?.profile;
  }

  async getTags() {
    const result = await this.#apiCall({ url: "/api/tags" });
    return result.data?.tags;
  }
}

module.exports = { AnythinkClient };
