/**
 * Rutes / Auth
 * host + /api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { inputsValidator } = require('../middlewares/inputs-validator');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post(
    '/register',
    [
        // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener como mínimo 6 caracteres').isLength({ min: 6 }),
        inputsValidator
    ],
    createUser
);

router.post(
    '/',
    [
        // middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener como mínimo 6 caracteres').isLength({ min: 6 }),
        inputsValidator
    ],
    loginUser
);

router.get(
    '/renew',
    validateJWT, // si solo es un middleware, no usamos corchetes
    renewToken
);

module.exports = router;