const express = require('express')
const router = express.Router()
const {
  crearGrupo,
  unirseGrupo,
  obtenerMisGrupos,
  obtenerDetalleGrupo,
  editarGrupo,
  eliminarGrupo,
  expulsarMiembro
} = require('../controllers/grupoController')
const { verificarToken, verificarAdminGrupo } = require('../middleware/authMiddleware')

router.post('/', verificarToken, crearGrupo)
router.post('/unirse', verificarToken, unirseGrupo)
router.get('/me', verificarToken, obtenerMisGrupos)
router.get('/:id', verificarToken, obtenerDetalleGrupo)
router.put('/:id', verificarToken, verificarAdminGrupo, editarGrupo)
router.delete('/:id', verificarToken, verificarAdminGrupo, eliminarGrupo)
router.delete('/:id/miembros/:userId', verificarToken, verificarAdminGrupo, expulsarMiembro)

module.exports = router