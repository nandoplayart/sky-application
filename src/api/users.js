var UsuarioServices = require('../services/usuario.services')
const verifyJWT = require('./authentication/authentication.jwt');
module.exports = (app)=>{
    app.post('/signup',async (req,res,next)=>{

        let service = new UsuarioServices();
        let messageErrors = service.validate(req.body);  
        if(messageErrors.length > 0){
            res.status(401).json(messageErrors);
            return;
        }
        let email = req.body.email;        
        let user = await service.findByEmail(email);
        if(user){
            res.status(401).json({mensagem:"Email já cadastrado"});
            return;
        }    
        let userCreated = await service.signup(req.body);
        res.status(201).json(userCreated);
        return;
    });

    app.post('/signin',async (req,res,next)=>{
        let service = new UsuarioServices();
        let email = req.body.email;
        let senha = req.body.senha;
        if(!email || !senha){
            res.status(401).json({mensagem:"Informar email e senha para autenticação."});
            return;
        }        
        let user = await service.findByEmail(email);
        if(!user){
            res.status(401).json({mensagem:"Usuário e/ou senha inválidos."});
            return;
        }
        if(!service.validateUser(email,senha,user)){
            res.status(401).json({mensagem:"Usuário e/ou senha inválidos."});
            return;
        }     
       await service.updateLastAccess(user);
       let ret = await service.getUser(user._id);
        res.status(200).json(ret);
        return;
    });

    app.get('/users',verifyJWT,async(req,res,next) =>{
        let service = new UsuarioServices();
        let users = await service.getAllUsers();
        res.status(200).json(users);
    });


    app.get('/users/:id',verifyJWT,async (req,res,next) =>{
        let service = new UsuarioServices();
        let id = req.params.id;
        let user = await service.getUser(id);
       res.status(200).json(user);
    });

 
}