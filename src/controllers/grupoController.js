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

module.exports = { crearGrupo }