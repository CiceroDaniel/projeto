const express = require('express')
const res = require('express/lib/response')
const Mongoose = require('mongoose')
const router = express.Router()

router.get('/', (req, res)=>{
  res.render('users/index')
})

module.exports = router