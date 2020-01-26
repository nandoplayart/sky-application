var { User, properties } = require("../models/user.model");
var jwt = require("jsonwebtoken");
var crypto = require("crypto-js");
class UsuarioServices {
  constructor() {}
  validate(body) {
    let user = new User(body);
    let validation = user.validateSync();
    let messages = [];
    if (validation) {
      properties.forEach(property => {
        if (validation.errors[property])
          messages.push({ mensagem: validation.errors[property].message });
      });
    }
    return messages;
  }

  validateUser(email, senha, user) {
    let senhaDecrypt = crypto.AES.decrypt(
      user.senha,
      process.env.SALT_ROUNDS
    ).toString(crypto.enc.Utf8);
    var ret = senha === senhaDecrypt && user.email === email;
    console.log(ret);
    return ret;
  }

  findByEmail = async email => {
    return await User.findOne({ email: email });
  };

  updateLastAccess = async user => {
    user.ultimo_login = new Date();
    await User.updateOne(
      { _id: user._id },
      { $set: { ultimo_login: user.ultimo_login } }
    );
  };

  signup = async body => {
    var user = new User(body);
    let senha = crypto.AES.encrypt(body.senha, process.env.SALT_ROUNDS);
    console.log(user);
    var token = jwt.sign(user.toJSON(), process.env.SECRET, {
      expiresIn: 1800 // expire in 30 min
    });
    let today = new Date();
    user.senha = senha;
    user.token = token;
    user.data_criacao = today;
    user.data_atualizacao = null;
    user.ultimo_login = today;
    await user.save();
    return await this.getUser(user._id);
  };

  getUser = async id => {
    let user = await User.findById(
      id,
      "_id nome email telefones token data_criacao data_atualizacao ultimo_login"
    );
    return user;
  };

  getAllUsers = async () => {
    return await User.find(
      {},
      "_id nome email telefones token data_criacao data_atualizacao ultimo_login"
    );
  };
}

module.exports = UsuarioServices;
