const KEY = "CLE_SECRET_123";
const urlKey = new URLSearchParams(location.search).get("key");

if (urlKey !== KEY) {
  document.body.innerHTML = "Access denied";
  throw new Error("Unauthorized");
}
