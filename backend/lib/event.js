const axiosLib = require("axios");
const fs = require("fs");

const WILCO_ID = process.env.WILCO_ID || fs.readFileSync('../.wilco', 'utf8')
const baseURL = process.env.ENGINE_BASE_URL || "https://engine.wilco.gg"

const axios = axiosLib.create({
  baseURL: baseURL,
  headers: {
    'Content-type': 'application/json',
  },
});

async function sendEvent(event, metadata) {
    try {
        const result = await axios.post(`/users/${WILCO_ID}/event`, JSON.stringify({event, metadata}));
        return result.data;
    } catch (error) {
        console.error(`failed to send event ${event} to Wilco engine`)
    }
}

module.exports = {
  sendEvent,
}
