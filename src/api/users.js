const UsuarioServices = require("../services/usuario.services");

const verifyJWT = require("./authentication/authentication.jwt");

module.exports = app => {
  // eslint-disable-next-line no-unused-vars
  app.post("/signup", async (req, res, next) => {
    const service = new UsuarioServices();
    const messageErrors = service.validate(req.body);
    if (messageErrors.length > 0) {
      res.status(401).json(messageErrors);
      return;
    }
    const { email } = req.body;
    const user = await service.findByEmail(email);
    if (user) {
      res.status(401).json({ mensagem: "Email já cadastrado" });
      return;
    }
    const userCreated = await service.signup(req.body);
    res.status(201).json(userCreated);
  });

  // eslint-disable-next-line no-unused-vars
  app.post("/signin", async (req, res, next) => {
    const service = new UsuarioServices();
    const { email } = req.body;
    const { senha } = req.body;
    if (!email || !senha) {
      res
        .status(401)
        .json({ mensagem: "Informar email e senha para autenticação." });
      return;
    }
    const user = await service.findByEmail(email);
    if (!user) {
      res.status(401).json({ mensagem: "Usuário e/ou senha inválidos." });
      return;
    }
    if (!service.validateUser(email, senha, user)) {
      res.status(401).json({ mensagem: "Usuário e/ou senha inválidos." });
      return;
    }
    await service.updateLastAccess(user);
    // eslint-disable-next-line no-underscore-dangle
    const ret = await service.getUser(user._id);
    res.status(200).json(ret);
  });

  // eslint-disable-next-line no-unused-vars
  app.get("/users", verifyJWT, async (req, res, next) => {
    const service = new UsuarioServices();
    const users = await service.getAllUsers();
    res.status(200).json(users);
  });

  // eslint-disable-next-line no-unused-vars
  app.get("/users/:id", verifyJWT, async (req, res, next) => {
    const service = new UsuarioServices();
    const { id } = req.params;
    const user = await service.getUser(id);
    res.status(200).json(user);
  });
};
