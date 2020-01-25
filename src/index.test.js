require('dotenv-safe').config();
require('./server/server.test').runTests();
require('./api/users.test').runTests();
