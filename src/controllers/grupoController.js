const Grupo = require('../models/Grupo')
const Membresia = require('../models/Membresia')

const generarCodigoInvitacion = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }
  return codigo
}

const crearGrupo = async (req, res) => {
  try {
    const { nombre, descripcion, liga, modo, apuesta, visibilidad } = req.body

    if (!nombre || !liga) {
      return res.status(400).json({ mensaje: 'Nombre y liga son obligatorios' })
    }

    let codigoInvitacion
    let codigoUnico = false
    while (!codigoUnico) {
      codigoInvitacion = generarCodigoInvitacion()
      const codigoExistente = await Grupo.findOne({ codigoInvitacion })
      if (!codigoExistente) codigoUnico = true
    }

    const nuevoGrupo = new Grupo({
      nombre,
      descripcion,
      liga,
      modo: modo || '1X2',
      apuesta,
      visibilidad: visibilidad || 'privado',
      codigoInvitacion,
      creadoPor: req.usuario.id
    })

    await nuevoGrupo.save()

    const membresia = new Membresia({
      userId: req.usuario.id,
      grupoId: nuevoGrupo._id,
      rol: 'admin'
    })

    await membresia.save()

    res.status(201).json({
      mensaje: 'Grupo creado correctamente',
      grupo: nuevoGrupo
    })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const unirseGrupo = async (req, res) => {
  try {
    const { codigoInvitacion } = req.body

    if (!codigoInvitacion) {
      return res.status(400).json({ mensaje: 'El código de invitación es obligatorio' })
    }

    const grupo = await Grupo.findOne({ codigoInvitacion: codigoInvitacion.toUpperCase() })
    if (!grupo) {
      return res.status(404).json({ mensaje: 'No existe ningún grupo con ese código' })
    }

    const membresiaExistente = await Membresia.findOne({
      userId: req.usuario.id,
      grupoId: grupo._id
    })
    if (membresiaExistente) {
      return res.status(400).json({ mensaje: 'Ya perteneces a este grupo' })
    }

    const membresia = new Membresia({
      userId: req.usuario.id,
      grupoId: grupo._id,
      rol: 'miembro'
    })

    await membresia.save()

    res.status(201).json({
      mensaje: 'Te has unido al grupo correctamente',
      grupo
    })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerMisGrupos = async (req, res) => {
  try {
    const membresias = await Membresia.find({ userId: req.usuario.id }).populate('grupoId')

    const grupos = membresias
      .filter(m => m.grupoId !== null)
      .map(m => ({
        _id: m.grupoId._id,
        nombre: m.grupoId.nombre,
        descripcion: m.grupoId.descripcion,
        liga: m.grupoId.liga,
        modo: m.grupoId.modo,
        apuesta: m.grupoId.apuesta,
        visibilidad: m.grupoId.visibilidad,
        codigoInvitacion: m.grupoId.codigoInvitacion,
        rolUsuario: m.rol
      }))

    res.json(grupos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

const obtenerDetalleGrupo = async (req, res) => {
  try {
    const { id } = req.params

    const grupo = await Grupo.findById(id)
    if (!grupo) {
      return res.status(404).json({ mensaje: 'Grupo no encontrado' })
    }

    const membresiaUsuario = await Membresia.findOne({
      userId: req.usuario.id,
      grupoId: id
    })
    if (!membresiaUsuario) {
      return res.status(403).json({ mensaje: 'No perteneces a este grupo' })
    }

    const membresias = await Membresia.find({ grupoId: id }).populate('userId', 'nombre username equipoFavorito')

    const miembros = membresias.map(m => ({
      _id: m.userId._id,
      nombre: m.userId.nombre,
      username: m.userId.username,
      equipoFavorito: m.userId.equipoFavorito,
      rol: m.rol,
      fechaUnion: m.fechaUnion
    }))

    res.json({
      grupo,
      miembros,
      rolUsuario: membresiaUsuario.rol
    })

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message })
  }
}

module.exports = { crearGrupo, unirseGrupo, obtenerMisGrupos, obtenerDetalleGrupo }