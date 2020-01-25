var userSchema ={
    "id": "/User",
    "type":"object",
    "properties":{
        "nome":{
            "type":"string",
            "required":true,
            "message":{
                "required": "O nome deve ser informado"
            }
        },
        "email":{
            "type":"string"
        },
        "senha":{
            "type":"string"
        },
        "telefones": {
            "type":"array",
            "$ref": "/Address"
        }

    },
  //  "required":["nome","email","senha","telefones"]
};

var addressSchema = {
    "id": "/Address",
    "type":"array",
    "properties":{
        "numero": "int",
        "ddd":"string"
    },
    "required": ["numero","ddd"]
}

function validate(user){
    let Validator = require('jsonschema').Validator;
    let v = new Validator();
    v.addSchema(addressSchema, '/Address');
    return v.validate(user, userSchema);
}

module.exports = validate;

