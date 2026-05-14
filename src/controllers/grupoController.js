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

module.exports = { crearGrupo, unirseGrupo }