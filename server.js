const http = require("http");

const createTournamentController = require("./controllers/createTournament");
const Middlewares = require("./middleware/middlewares");

const server = http.createServer(async (req, res) => {
  Middlewares.cors(req, res, () => {
    Middlewares.setDefaultHeaders(req, res, () => {
      if (req.url === "/" && req.method === "GET") {
        createTournamentController.createTournament(req, res);
      }
    });
  });
});

server.listen(5000, () => {
  console.log("Running...");
});
