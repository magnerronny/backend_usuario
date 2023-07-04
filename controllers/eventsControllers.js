const { response, request } = require("express");
const EventoModels = require("../models/EventoModels");

const getEventos = async(req = request, res = response) =>{

  try {
    const eventos = await EventoModels.find().populate('user', 'name');

    res.json({
      ok: true,
      eventos
    }
    )

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "comuniquese con el administrador"
    })
  }
}


const crearEvento = async(req = request, res = response) =>{

  const evento = new EventoModels(req.body);

  try {
    evento.user = req.uid;
    const eventoSave =  await evento.save();
    res.status(201).json({
      ok: true,
      evento: eventoSave
    })

  } catch (error) {
    // console.log(error)
    return res.status(500).json({
      ok: false,
      msg: "comuniquese con el administrador"
    })
  }

}


const actualizarEvento = async(req = request, res = response) =>{
  const eventoid = req.params.id;
  try {
    const evento = await EventoModels.findById(eventoid)
    if(!evento){
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe con ese id'
      })
    }
    if(evento.user.toString() !== req.uid){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios de editar el evento'
      })
    }

    const nuevoEvento = {
      ...req.body,
      user:req.uid
    }

    const eventoActualizado = await EventoModels.findByIdAndUpdate(eventoid, nuevoEvento, {new: true})
    res.json({
      ok: true, 
      evento:eventoActualizado
    })
    
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "comuniquese con el administrador"
    })
  }

}


const eliminarEvento = async(req = request, res = response) =>{
  const eventoid = req.params.id;

  try {
    const evento = await EventoModels.findById(eventoid)
    if(!evento){
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe con ese id'
      })
    }
    if(evento.user.toString() !== req.uid){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegios de eliminar  el evento'
      })
    }


    const eventoEliminado = await EventoModels.findByIdAndDelete(eventoid)
    res.json({
      ok: true, 
      evento:eventoEliminado
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "comuniquese con el administrador"
    })
  }
}


module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}

