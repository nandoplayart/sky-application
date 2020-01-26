require("dotenv-safe").config();
const usuarioService = require("./api/users");
const server = require("./server/server");

server.start(usuarioService, (err, app) => {
  // eslint-disable-next-line no-console
  console.log(err, app, "run server - users");
});
