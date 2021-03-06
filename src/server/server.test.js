const test = require("tape");
const server = require("./server");

function apiMock(app) {
  // eslint-disable-next-line no-console
  console.log(app, "do nothing");
}

function runTests() {
  test("Server Start", t => {
    server.start(apiMock, (err, srv) => {
      t.assert(!err && srv, "Serverstarted");
      t.end();
    });
  });

  test("Server Stop", t => {
    t.assert(server.stop(), "Server Stop");
    t.end();
  });
}

module.exports = { runTests };
