const mongoose = require('mongoose')

const grupoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  liga: {
    type: String,
    required: true,
    enum: ['LaLiga', 'Premier', 'Bundesliga', 'SerieA', 'Ligue1']
  },
  modo: {
    type: String,
    required: true,
    enum: ['1X2', 'exacto'],
    default: '1X2'
  },
  apuesta: {
    type: String,
    default: ''
  },
  visibilidad: {
    type: String,
    enum: ['privado', 'publico'],
    default: 'privado'
  },
  codigoInvitacion: {
    type: String,
    required: true,
    unique: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Grupo', grupoSchema)