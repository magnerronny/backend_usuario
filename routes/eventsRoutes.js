
const { Router } = require("express");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/eventsControllers");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");
const router = Router();

//* todos tienen que pasae validar jwt
router.use( validarJWT )
//* obtener eventos
router.get('/', getEventos)

//* crear un nuevo evento
router.post('/',
  [
    check('title', 'el titulo es obligatorio').not().isEmpty(),
    check('start', ' fecha de inicio es obligatorio').custom(isDate),
    check('end', ' fecha de finalizacion es obligatoria').custom(isDate),

    validarCampos
  ],
  crearEvento)

//* actualizar evento
router.put('/:id', actualizarEvento)

//* borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router
