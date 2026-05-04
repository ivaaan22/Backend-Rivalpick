const Usuario = require('../models/Usuario')

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password')

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, username, equipoFavorito } = req.body

    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }

    if (username && username !== usuario.username) {
      const usernameExistente = await Usuario.findOne({ username })
      if (usernameExistente) {
        return res.status(400).json({ mensaje: 'El username ya está en uso' })
      }
      usuario.username = username
    }

    if (nombre) usuario.nombre = nombre
    if (equipoFavorito !== undefined) usuario.equipoFavorito = equipoFavorito

    await usuario.save()

    const usuarioActualizado = await Usuario.findById(usuario._id).select('-password')

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado
    })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { obtenerPerfil, actualizarPerfil }