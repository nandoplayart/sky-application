require('dotenv-safe').config();
const usuarioService = require('./api/users')
const server = require('./server/server')

server.start(usuarioService,(err,app)=>{
    console.log('run server - users');
});
