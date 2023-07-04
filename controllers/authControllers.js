const { response, request } = require("express");
const usuarioModels = require("../models/usuarioModels");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req = request, res =  response) => {
  const {email, password} =  req.body;

  try {
    let usuario = await usuarioModels.findOne({email});

    if(usuario){
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo'
      })
    }
    usuario = new usuarioModels(req.body);

    // encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)
    await usuario.save()
    const token = await generarJWT(usuario.id, usuario.name)
    
    res.status(201).json({
      ok: true,
      usuario,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'por favor comunicarse con el administrador'
    })
  }
}

const loginUsuario = async(req = request, res = response) => {
  const {email, password} =  req.body;

  try {
    const usuario = await usuarioModels.findOne({email});

    if(!usuario){
      return res.status(400).json({
        ok: false,
        msg: 'El Usuario no existe con ese email'
      })
    }

    // Confirmar Password
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }

    // Generar nuestro JWt
    const token = await generarJWT(usuario.id, usuario.name)

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'por favor comunicarse con el administrador'
    })
  }

}

const revalidarToken = async(req, res) => {

  const {uid, name} = req
  const token =  await generarJWT(uid, name)
  res.json({
    ok: true,
    uid,
    name,
    token
  })
}


module.exports =  {
  crearUsuario,
  loginUsuario,
  revalidarToken,
}