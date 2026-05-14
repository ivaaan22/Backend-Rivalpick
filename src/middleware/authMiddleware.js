const jwt = require('jsonwebtoken')
const Membresia = require('../models/Membresia')

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'No autorizado, falta token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' })
  }
}

const verificarSuperadmin = (req, res, next) => {
  if (req.usuario.rol !== 'superadmin') {
    return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol superadmin' })
  }
  next()
}

const verificarAdminGrupo = async (req, res, next) => {
  try {
    const grupoId = req.params.id

    const membresia = await Membresia.findOne({
      userId: req.usuario.id,
      grupoId: grupoId
    })

    if (!membresia) {
      return res.status(403).json({ mensaje: 'No perteneces a este grupo' })
    }

    if (membresia.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Solo el administrador del grupo puede hacer esto' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { verificarToken, verificarSuperadmin, verificarAdminGrupo }