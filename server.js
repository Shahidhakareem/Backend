const http = require("http");
const app = require("./app");

// Use PORT from Render or fallback to 3001 for local dev
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
