const test = require('tape');
const supertest = require('supertest');
const users = require('./users')
const server = require('../server/server');

function runTests(){
    var app = null;
    server.start(users,(err,app)=>{
        var email = `test${Math.floor(Math.random() * (100000 - 10) + 10)}@hotmail.com`;
        var token = '';
        var id = '';
        test('POST/signup - Usuário criado com sucesso ',t=>{
            supertest(app)
            .post('/signup')
            .send({
                    nome: "test 1",
                    email: email,
                    senha: "1111",
                    telefones: [
                      {
                        "numero": "123456",
                        "ddd": "11"
                      }
                    ]    
            })
            .expect('Content-Type',/json/)
            .expect(201).end((err,res)=>{
                token = `Bearer ${res.body.token}`;
                id = res.body._id;
                t.error(err,'Sem erros');
                t.assert(res.body._id , 'Usuário criado com sucesso');
                t.end();
            });
        });

        test('POST/signup - Email já cadastrado',t=>{
            supertest(app)
            .post('/signup')
            .send({
                
                    nome: "test 1",
                    email: email,
                    senha: "1111",
                    telefones: [
                      {
                        "numero": "123456",
                        "ddd": "11"
                      }
                    ]    
            })
            .expect('Content-Type',/json/)
            .expect(401).end((err,res)=>{
                t.error(err,'Sem erros');
                t.assert(res.body.mensagem , 'Email já cadastrado');
                t.end();
            });
        });

        test('POST/signin - autenticar usuário com sucesso',t=>{
            supertest(app)
            .post('/signin')
            .send({
                    email: email,
                    senha: "1111",
            })
            .expect('Content-Type',/json/)
            .expect(200).end((err,res)=>{
                t.error(err,'Sem erros');
                t.assert(res.body._id , 'Usuário autenticado com sucesso');
                t.end();
            });
        });

        test('POST/signin - tentar autenticar usuário com email inexistente',t=>{
            supertest(app)
            .post('/signin')
            .send({
                    email: "t@t.com",
                    senha: "1111",
            })
            .expect('Content-Type',/json/)
            .expect(401).end((err,res)=>{
                t.error(err,'Sem erros');
                t.assert(res.body.mensagem , 'Usuário e/ou senha inválidos');
                t.end();
            });
        });

        test('GET/users - tentar buscar os usuário sem autenticação',t=>{
            supertest(app)
            .get('/users')
            .expect('Content-Type',/json/)
            .expect(401).end((err,res)=>{
                t.error(err,'Sem erros');
                t.assert(res.body.mensagem , 'Não autorizado');
                t.end();
            });
        });

        test('GET/users - buscar os usuário com autenticação',t=>{
            supertest(app)
            .get('/users')
            .set('x-access-token',token)
            .expect('Content-Type',/json/)
            .expect(200).end((err,res)=>{
                t.error(err,'Sem erros');
                t.assert(res.body , 'Usuários retornados com sucesso');
                t.end();
            });
        });
        test('GET/users/:id - buscar usuário com autenticação',t=>{
            supertest(app)
            .get('/users')
            .send({id: id})
            .set('x-access-token',token)
            .expect('Content-Type',/json/)
            .expect(200).end((err,res)=>{
                t.error(err,'Sem erros');
                t.assert(res.body , 'Usuário retornado com sucesso');
                t.end();
            });
        });

        server.stop();
    });
}


module.exports = {runTests}