const { obtenerPartidosPorJornada } = require('../services/footballService')

const getPartidos = async (req, res) => {
  try {
    const { liga, jornada } = req.query

    if (!liga || !jornada) {
      return res.status(400).json({ mensaje: 'Liga y jornada son obligatorios' })
    }

    const partidos = await obtenerPartidosPorJornada(liga, jornada)

    res.json(partidos)

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los partidos', error: error.message })
  }
}

module.exports = { getPartidos }