module.exports = async (config) => {
  process.env.REACT_APP_URL = "http://localhost:3000";
  process.env.BACKEND_URL = "http://localhost:3001";
  process.env.BACKEND_API_URL = `${process.env.BACKEND_URL}/api`;
};
