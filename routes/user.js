const { Router } = require('express')
const express = require('express')
const res = require('express/lib/response')
const Mongoose = require('mongoose')
require("../models/Users")
const Usuario = Mongoose.model("usuarios")
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/', (req, res)=>{
  res.render('usuario/index')
})
router.get('/registro', (req, res)=>{
  res.render('usuario/registro')
})

router.post('/registro', (req, res)=>{
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Noome invalido"})
  }
  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
    erros.push({texto: "Email invalida"})
  }
  if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
    erros.push({texto: "Senha invalido"})
  }
  if(erros.length > 0){
    res.render('usuario/index', {erros: erros})
  }else{
    Usuario.findOne({email: req.body.email}).then((usuario)=>{
      if(usuario){
        req.flash("error_msg", "Já existe um usuário com este E-mail")
        res.redirect('/usuario/registro')
      }else{
        const novoUsuário = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        })

        bcrypt.genSalt(10, (erro, salt)=>{
          bcrypt.hash(novoUsuário.senha, salt, (erro, hash)=>{
            if(erro){
              req.flash("error_msg", "hpuve um erro no salvamento do usuário")
              res.redirect('/')
            }

            novoUsuário.senha = hash
            novoUsuário.save().then(()=>{
              req.flash("success_msg", "Usuário criado com sucesso!")
              res.redirect('/')
            }).catch((err)=>{
              req.flash("error_msg", "houve um erro ao criar o usuário")
              res.redirect('/')
              console.log("erro: "+err)
            })

          })
        })
      }
    }).catch((err)=>{
      req.flash("error_msg", "houve um erro interno")
      res.redirect('/')
    })
  }
})

router.get('/login', (req, res)=>{
  res.render('usuario/login')
})

router.post('/login', (req, res, next)=>{
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/usuario/login",
      failureFlash: true
    })(req, res, next)
})

router.get('/agendar', (req, res)=>{
  res.render('usuario/agendar')
})

router.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});

  module.exports = router