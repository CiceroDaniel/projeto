const express = require('express')
const router = express.Router()
const Mongoose = require("mongoose")
require("../models/Mesa")
const Mesa = Mongoose.model("mesas")


router.get('/', (req, res)=>{
  res.render("index")
})

router.get('/mesas', (req, res) => {
  Mesa.find({}).lean().then((mesas) => {  
  res.render('admin/mesas', {mesas: mesas})
  }).catch((err) => {
    console.log("houve um erro: "+err)
  })
})

router.get('/mesas/add', (req, res) => {
  res.render('admin/addMesas')
})

router.post('/mesas/new', (req, res) => {
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

module.exports = router