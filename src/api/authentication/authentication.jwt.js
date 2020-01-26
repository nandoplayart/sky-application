const jwt = require("jsonwebtoken");
const UsuarioServices = require("../../services/usuario.services");

const verifyJWT = async (req, res, next) => {
  const service = new UsuarioServices();
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ mensagem: "Não autorizado" });
  }
  if (token.split(" ").length !== 2) {
    return res.status(401).send({ mensagem: "token em um formato inválido" });
  }

  jwt.verify(
    token.split(" ")[1],
    process.env.SECRET,
    // eslint-disable-next-line consistent-return
    async (err, userToken) => {
      if (err) {
        return res.status(401).send({ mensagem: "Sessão inválid" });
      }

      const user = await service.findByEmail(userToken.email);
      if (token !== `Bearer ${user.token}`) {
        return res.status(401).send({ mensagem: "Não autorizado" });
      }
      next();
    }
  );
};

module.exports = verifyJWT;
