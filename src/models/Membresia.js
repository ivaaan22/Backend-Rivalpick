const mongoose = require('mongoose')

const membresiaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  grupoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupo',
    required: true
  },
  rol: {
    type: String,
    enum: ['admin', 'miembro'],
    default: 'miembro'
  },
  fechaUnion: {
    type: Date,
    default: Date.now
  }
})

membresiaSchema.index({ userId: 1, grupoId: 1 }, { unique: true })

module.exports = mongoose.model('Membresia', membresiaSchema)