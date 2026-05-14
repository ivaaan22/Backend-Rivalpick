const express = require('express')
const router = express.Router()
const { crearGrupo, unirseGrupo, obtenerMisGrupos, obtenerDetalleGrupo } = require('../controllers/grupoController')
const { verificarToken } = require('../middleware/authMiddleware')

router.post('/', verificarToken, crearGrupo)
router.post('/unirse', verificarToken, unirseGrupo)
router.get('/me', verificarToken, obtenerMisGrupos)
router.get('/:id', verificarToken, obtenerDetalleGrupo)

module.exports = router