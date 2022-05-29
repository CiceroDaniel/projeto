const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
router.get('/', (req, res)=>{
  res.send("teste")
})
router.get('/login', (req, res)=>{
  res.render('./login')
})

module.exports = router