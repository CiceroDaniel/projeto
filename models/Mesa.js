const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Mesa = new Schema({
  numero: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true
  },
  valor: {
    type: String,
    required: true
  },
  cad: {
    type: String,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model("mesas", Mesa)