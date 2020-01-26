const mongoose = require("mongoose");

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  numero: {
    type: String,
    required: [true, "O numero deve ser informado"]
  },
  ddd: {
    type: String,
    required: [true, "O ddd deve ser informado"]
  }
});

const schema = new Schema({
  nome: {
    type: String,
    required: [true, "O nome deve ser informado"]
  },
  email: {
    type: String,
    required: [true, "O email deve ser informado"]
  },
  senha: {
    type: String,
    required: [true, "A senha deve ser informada"]
  },
  telefones: {
    type: [addressSchema],
    required: [true, "Ao menos um telefone deve ser informado"]
  },
  token: {
    type: String
  },
  data_criacao: {
    type: Date
  },
  data_atualizacao: {
    type: Date
  },
  ultimo_login: {
    type: Date
  }
});

const User = mongoose.model("users", schema);

const properties = ["nome", "email", "senha", "telefones"];
module.exports = { User, properties };
