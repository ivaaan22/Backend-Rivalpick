const express = require('express')
const router = express.Router()
const { crearGrupo, unirseGrupo } = require('../controllers/grupoController')
const { verificarToken } = require('../middleware/authMiddleware')

router.post('/', verificarToken, crearGrupo)
router.post('/unirse', verificarToken, unirseGrupo)

module.exports = router