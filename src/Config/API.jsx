// Dynamic API Configuration supporting Local Dev and Production
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168."));

const API = {
  BASE_URL:
    process.env.REACT_APP_API_URL ||
    (isLocalhost
      ? "http://localhost:4800/api/v1/"
      : "https://api.parakshtach.com/api/v1/"),
  BASE_URL_IMAGES:
    process.env.REACT_APP_API_IMAGES ||
    (isLocalhost
      ? "http://localhost:4800/api/v1/uploads/"
      : "https://api.parakshtach.com/api/v1/uploads/"),
};

export default API;
