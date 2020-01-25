var jwt = require('jsonwebtoken');
var UsuarioServices = require('../../services/usuario.services');
const verifyJWT = async (req, res, next)=>{
    let service = new UsuarioServices();
    var token = req.headers["x-access-token"];
    console.log(token);
    
    if(!token){
        return res.status(401).send({ mensagem: 'Não autorizado' });
    }
    let userToken = jwt.verify(token.split(' ')[1],process.env.SECRET);
    let user = await service.findByEmail(userToken.email);
    if(token !== 'Bearer ' + user.token){
        return res.status(401).send({ mensagem: 'Não autorizado' });
    }

    next();
}

module.exports = verifyJWT;