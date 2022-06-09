const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const Mongoose = require("mongoose")
require("../models/Mesa")
const Mesa = Mongoose.model("mesas")
require("../models/Users")
const Usuario = Mongoose.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {eAdmin} = require("../helpers/eAdmin")


router.get('/', eAdmin, (req, res)=>{
  res.render("admin/index")
})

router.get('/mesas', eAdmin, (req, res) => {
  Mesa.find({}).lean().sort({date: 'desc'}).then((mesas) => {  
  res.render('admin/mesas', {mesas: mesas})
  }).catch((err) => {
    console.log("houve um erro: "+err)
  })
})

router.get('/mesas/add', eAdmin, (req, res) => {
  res.render('admin/addMesas')
})

router.post('/mesas/new', eAdmin, (req, res) => {
  var erros = []

  if(!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null){
    erros.push({texto: "Número invalido"})
  }
  if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
    erros.push({texto: "Descrição invalida"})
  }
  if(req.body.descricao.length < 2){
    erros.push({texto: "Descrição muito pequena"})
  }
  if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
    erros.push({texto: "valor invalido"})
  }
  if(erros.length > 0){
    res.render('admin/addMesas', {erros: erros})
  }else{
    const novaMesa = {
      numero: req.body.numero,
      descricao: req.body.descricao,
      valor: req.body.valor
    }
    new Mesa(novaMesa).save().then(() => {
      req.flash("success_msg", "Mesa cadastrada com sucesso")
      res.redirect('/admin/mesas')
    }).catch((err) => {
      req.flash("error_msg", "erro ao cadastrar a nova mesa!")
      res.redirect('/admin')
    })
  }
})

router.get('/mesas/edit/:id', eAdmin, (req, res) => {
  Mesa.findOne({_id:req.params.id}).lean().then((mesa) => {
  res.render('admin/editMesas', {Mesa: mesa})
}).catch((err) => {
  req.flash("error_msg", "Essa mesa não existe")
  res.redirect('/admin/mesas')
})
})

router.post('/mesas/edit', eAdmin, (req, res) => {
  Mesa.findOne({_id: req.body.id}).then((mesa) => {

    var erros = []

    if(!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null){
      erros.push({texto: "Número invalido"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
      erros.push({texto: "Descrição invalida"})
    }
    if(req.body.descricao.length < 2){
      erros.push({texto: "Descrição muito pequena"})
    }
    if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
      erros.push({texto: "valor invalido"})
    }
    if(erros.length > 0){
      res.render('admin/addMesas', {erros: erros})
    }else{
      mesa.numero = req.body.numero
      mesa.descricao = req.body.descricao
      mesa.valor = req.body.valor

      mesa.save().then(()=>{
        req.flash("success_msg", "Alterações salvas com success")
        res.redirect('/admin/mesas')
      }).catch((err)=>{
        req.flash("error_msg", "houve um erro interno ao salvar as alterações")
      })
    }
  }).catch((err)=>{
    req.flash("error_msg", "houve um erro ao editar")
    res.redirect('/admin/mesas')
  })
})

router.post('/mesas/deletar', eAdmin, (req, res)=>{
  Mesa.remove({_id: req.body.id}).then(()=>{
    req.flash("success_msg", "Mesa deletada com sucesso")
    res.redirect('/admin/mesas')
  }).catch((err)=>{
    req.flash("error_msg", "houve um erro ao deletar a mesa")
    res.redirect('/admin/mesas')
  })
})

router.get('/admins', eAdmin, (req, res)=>{
  Usuario.find({}).lean().sort({date: 'desc'}).then((usuario)=>{
    res.render("admin/admins", {usuarios: usuario})
  }).catch((err)=>{
    console.log("houve um erro: "+err)
  })
})

router.get('/admin/add', eAdmin, (req, res)=>{
  res.render('admin/addAdmin')
})

router.post('/admin/add', eAdmin, (req, res)=>{
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
    res.render('admin/index', {erros: erros})
  }else{
    Usuario.findOne({email: req.body.email}).then((usuario)=>{
      if(usuario){
        req.flash("error_msg", "Já existe um usuário com este E-mail")
        res.redirect('/admin/registro')
      }else{
        const novoUsuário = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
          eAdmin: 1
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

router.get('/admin/edit/:id', eAdmin, (req, res) => {
  Usuario.findOne({_id:req.params.id}).lean().then((usuario) => {
  res.render('admin/editMesas', {Usuario: usuario})
}).catch((err) => {
  req.flash("error_msg", "Essa mesa não existe")
  res.redirect('/admin/admins')
})
})

router.post('/admin/edit', eAdmin, (req, res) => {
  Mesa.findOne({_id: req.body.id}).then((usuario) => {

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
    res.render('admin/index', {erros: erros})
  }else{


      mesa.numero = req.body.numero
      mesa.descricao = req.body.descricao
      mesa.valor = req.body.valor

      Usuario.save().then(()=>{
        req.flash("success_msg", "Alterações salvas com success")
        res.redirect('/admin/admins')
      }).catch((err)=>{
        req.flash("error_msg", "houve um erro interno ao salvar as alterações")
      })
    }
  }).catch((err)=>{
    req.flash("error_msg", "houve um erro ao editar")
    res.redirect('/admin/admins')
  })
})

router.post('/admin/deletar', eAdmin, (req, res)=>{
  Usuario.remove({_id: req.body.id}).then(()=>{
    req.flash("success_msg", "Mesa deletada com sucesso")
    res.redirect('/admin/admins')
  }).catch((err)=>{
    req.flash("error_msg", "houve um erro ao deletar a mesa")
    res.redirect('/admin/admins')
  })
})

module.exports = router