const express = require('express')
//usado para logar informação das requisições no console
const morgan = require('morgan')
//usado para proteção da api de ataques hackers
const helmet = require('helmet')

const bodyParser = require('body-parser');

//documentação com swagger
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../swagger');

var server = null;

function start(api,callbak){
    var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true});
    const app = express();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(bodyParser.json());
    api(app);
    app.use((err,req,res,next)=>{
       res.status(404).json({message: 'Página não encontrada'});
    });

    server = app.listen(process.env.PORT, ()=> callbak(null,server));
}

function stop(){
    if(server) server.close();
    return true;
}

module.exports = { start,stop }