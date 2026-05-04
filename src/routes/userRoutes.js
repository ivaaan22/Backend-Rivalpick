const express = require('express')
const router = express.Router()
const { obtenerPerfil, actualizarPerfil } = require('../controllers/userController')
const { verificarToken } = require('../middleware/authMiddleware')

router.get('/me', verificarToken, obtenerPerfil)
router.put('/me', verificarToken, actualizarPerfil)

module.exports = router