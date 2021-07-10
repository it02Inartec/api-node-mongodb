const { response } = require('express');
const { validationResult } = require('express-validator');

const inputsValidator = ( request, res = response , next) => {
    
    // errors manager
    const errors = validationResult( request );
    if ( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}

module.exports = {
    inputsValidator
};