const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config()

// crear el servidor de express
const app = express();

// Base de Datos
dbConnection();    

app.use(cors());

app.use(express.static('public'))
app.use(express.json())


// rutas
// TODO: auth // crear, login, renew
app.use('/api/auth', require('./routes/authRoutes'))
// TODO: CRUD: Eventos
app.use('/api/events', require('./routes/eventsRoutes'))




//EScuchar peticiones
app.listen(4000, () => {
  console.log(`ser ver listeingi inport ${4000}`)
})
