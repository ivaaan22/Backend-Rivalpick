const jwt = require('jsonwebtoken')

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

module.exports = { verificarToken, verificarSuperadmin }