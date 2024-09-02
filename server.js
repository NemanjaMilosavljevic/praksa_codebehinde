const http = require("http");

const createTournamentController = require("./controllers/createTournament");

const server = http.createServer(async (req, res) => {});

server.listen(5000, (req, res) => {
  console.log("Running...");
  createTournamentController.createTournament(req, res);
});
