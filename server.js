const http = require("http");

const server = http.createServer(async (req, res) => {
  res.write("Hello");
  res.end();
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Running...");
});
