const express = require('express')
const router = express.Router()
const { getPartidos } = require('../controllers/partidoController')
const { verificarToken } = require('../middleware/authMiddleware')

router.get('/', verificarToken, getPartidos)

module.exports = router