var jwt = require('jsonwebtoken');
var UsuarioServices = require('../../services/usuario.services');
const verifyJWT = async (req, res, next)=>{
    let service = new UsuarioServices();
    var token = req.headers["x-access-token"];
    console.log(token);
    
    if(!token){
        return res.status(401).send({ mensagem: 'Não autorizado' });
    }
    if(token.split(' ').length != 2){
        return res.status(401).send({ mensagem: 'token em um formato inválido' });
    }

    jwt.verify(token.split(' ')[1],process.env.SECRET,async(err,userToken)=>{
        if(err){
            return res.status(401).send({ mensagem: 'Sessão inválid' });
        }

        let user = await service.findByEmail(userToken.email);
        if(token !== 'Bearer ' + user.token){
            return res.status(401).send({ mensagem: 'Não autorizado' });
        }
        next();
    });
    

   
}

module.exports = verifyJWT;