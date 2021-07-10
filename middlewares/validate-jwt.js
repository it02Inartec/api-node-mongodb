// importamos solo para ayuda de tipiado, express aquí no es obligatorio
const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = ( request, _response = response, next ) => {

    // se espera x-token por headers
    const token = request.header('x-token');
    
    // si no existe el token, se envía fallido
    if ( !token ) {
        return _response.status(401).json({
            ok: false,
            msg: 'No existe el token en la petición'
        });
    }
    
    // se comprueba que el token es válido
    try {
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
        
        // se actualizan los valores enviados
        request.uid = uid;
        request.name = name;

    } catch (error) {
        return _response.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
    next();
}

module.exports = {
    validateJWT
}