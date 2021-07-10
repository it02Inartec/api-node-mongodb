const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvents, updateEvents, removeEvents } = require('../controllers/events');
// check e inputsValidator trabajan en conjunto
const { check } = require('express-validator');
const { inputsValidator } = require('../middlewares/inputs-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

// colocamos el middlewares por encima para indicar que todos los siguientes deben pasar por esta validación
router.use( validateJWT );

router.get('/', getEvents );

router.post(
    '/',
    [
        check('title', 'title is required').not().isEmpty(),
        check('start', 'start date is required').custom( isDate ),
        check('end', 'end date is required').custom( isDate ),
        inputsValidator
    ],
    createEvents );

router.put('/:id', updateEvents );

router.delete('/:id', removeEvents );

module.exports = router;