const express = require('express')
const router = express.Router()
const Mongoose = require("mongoose")
require("../models/Users")
const User = Mongoose.model("users")


router.get('/', (req, res)=>{
  res.render("index")
})
router.get('/users', (req, res)=>{
  res.render('admin/users')
})
router.get('/users/add', (req, res)=>{
  res.render('admin/addUsers')
})
router.get('/login', (req, res)=>{
  res.render('/admin/users')
})
router.post('/user/new', (req, res)=>{
  const newUser = {
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    senha: req.body.senha
  }

new User(newUser).save().then(() => {
    console.log("cadastro bem sucedido! que delicia")
  }).catch((err) => {
    console.log("erro ao cadastrar: "+err)
  })
})

module.exports = router