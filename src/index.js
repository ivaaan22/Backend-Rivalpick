const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const grupoRoutes = require('./routes/grupoRoutes')
const partidoRoutes = require('./routes/partidoRoutes')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.log('Error de conexión:', err))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/grupos', grupoRoutes)
app.use('/api/partidos', partidoRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de RivalPick funcionando' })
})

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})