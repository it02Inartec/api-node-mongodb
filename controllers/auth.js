const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

/**
 * Opcional para que muestre los atributos de response
 * const { response } = require('express');
 * response = response
 * y podremos ver la ayuda al escribir response.
 * NO ES OBLIGADO USARLO
 */
const createUser = async (request, _response = response) => {

    const { email, password } = request.body;
    // if ( name.length < 5 ) {
    //     return _response.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe tener mínimo 5 caracteres'
    //     })
    // }

    try {
        // se comprueba si existe el email
        let user = await User.findOne({ email });
        // ({ email: email }) como email tiene el mismo nombre
        // en el objeto, lo dejamos de la siguiente manera

        // si existe el email en la bd, recibe un objeto, sino un null
        if ( user ) {
            return _response.status(400).json({
                ok: false,
                msg: 'El email ya existe en la base de datos'
            });
        }

        // le pasamos los valores ingresados
        user = new User( request.body );

        // se encripta el password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // se guardan los datos
        await user.save();

        // se genera el token del usuario
        const token = await generateJWT( user.id, user.name );

        // se envía exitoso
        _response.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        // se envía fallido
        _response.status(500).json({
            ok: false,
            msg: 'Por favor, consulte a su administrador'
        });
    }

};

const loginUser = async (request, response) => {

    const { email, password } = request.body;

    try {

        // se comprueba si existe el email
        const user = await User.findOne({ email });

        // si devuelve null
        if ( !user ) {
            return response.status(209).json({
                ok: false,
                msg: 'El email no existe en la base de datos'
            });
        }

        // se compara el password ingresado con el que trae de user
        const validPassword = bcrypt.compareSync( password, user.password );

        // si es false no coinciden, si es true sí coinciden
        if ( !validPassword ) {
            return response.status(400).json({
                ok: false,
                msg: 'email/password incorrectos'
            });
        }

        // se genera el token del usuario
        const token = await generateJWT( user.id, user.name );

        // se envía exitoso
        response.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        // se envía fallido
        res.status(500).json({
            ok: false,
            msg: 'Por favor, consulte a su administrador'
        });
    }
}

const renewToken = async (request, response) => {

    const { uid, name } = request;

    // se actualiza el token del usuario
    const token = await generateJWT( uid, name );

    response.json({
        ok: true,
        token
    })
};

module.exports = {
    createUser,
    loginUser,
    renewToken
};