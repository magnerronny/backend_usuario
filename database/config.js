const mongoose = require('mongoose');

const dbConnection = async( ) => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/calendarioDB')
    console.log('Connected!')
  } catch (error) {
    console.log(error)
    throw new Error('Error al inicializar DB')
  }
} 

module.exports = {
  dbConnection
}