const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' })
    }

    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    const passwordValida = await bcrypt.compare(password, usuario.password)
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        username: usuario.username,
        rol: usuario.rol
      }
    })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { registro, login }