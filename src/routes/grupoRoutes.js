const express = require('express')
const router = express.Router()
const { crearGrupo } = require('../controllers/grupoController')
const { verificarToken } = require('../middleware/authMiddleware')

router.post('/', verificarToken, crearGrupo)

module.exports = router