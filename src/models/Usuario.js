const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  equipoFavorito: {
    type: String,
    default: ''
  },
  rol: {
    type: String,
    enum: ['usuario', 'superadmin'],
    default: 'usuario'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Usuario', usuarioSchema)