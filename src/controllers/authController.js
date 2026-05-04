const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')

const registro = async (req, res) => {
  try {
    const { nombre, email, password, username } = req.body

    if (!nombre || !email || !password || !username) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' })
    }

    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' })
    }

    const usernameExistente = await Usuario.findOne({ username })
    if (usernameExistente) {
      return res.status(400).json({ mensaje: 'El username ya está en uso' })
    }

    const passwordEncriptada = await bcrypt.hash(password, 10)

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptada,
      username
    })

    await nuevoUsuario.save()

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { registro }