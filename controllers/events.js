const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async ( _request, _response = response ) => {
    
    const events = await Event.find() // filtros y paginaciones {...}
                              .populate('user', 'name'); // para 2 campos se usa: 'name password'

    _response.status(200).json({
        ok: true,
        events
    });
};

const createEvents = async ( _request, _response = response ) => {
    
    const event = new Event( _request.body );
    
    try {
        event.user = _request.uid;

        const savedEvent = await event.save();

        _response.status(200).json({
            ok: true,
            event: savedEvent
        });
    } catch (error) {
        console.log(error);
        _response.status(500).json({
            ok: false,
            msg: 'Please, contact to administrador'
        });
    }
};

const updateEvents = async ( _request, _response = response ) => {

    // const idEvent = _request.params.id;

    try {
        const event = await Event.findById( _request.params.id );

        if ( !event ) {
            return _response.status( 404 ).json({
                ok: false,
                msg: 'Event is not found'
            });
        }

        if ( event.user.toString() !== _request.uid ) {
            return _response.status( 403 ).json({
                ok: false,
                msg: 'Access denied'
            })
        }

        const newEvent = {
            ..._request.body,
            user: _request.uid
        };

        const eventUpdated = await Event.findByIdAndUpdate(
            _request.params.id,
            newEvent,
            { new: true } // Without this value, for default is false and return old event
        );

        _response.json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        console.log(error);
        _response.status( 500 ).json({
            ok: false,
            msg: 'Please, contact to administrador'
        });
    }
};

const removeEvents = async ( _request, _response = response ) => {

    try {
        const event = await Event.findById( _request.params.id );

        if ( !event ) {
            return _response.status( 404 ).json({
                ok: false,
                msg: 'Event is not found'
            });
        }

        if ( event.user.toString() !== _request.uid ) {
            return _response.status( 403 ).json({
                ok: false,
                msg: 'Access denied'
            });
        }

        await Event.findByIdAndDelete( _request.params.id );

        _response.json({
            ok: true,
            msg: 'Event deleted'
        });

    } catch (error) {
        console.log(error);
        _response.status( 500 ).json({
            ok: false,
            msg: 'Please, contact to administrador'
        });
    }
};

module.exports = {
    getEvents,
    createEvents,
    updateEvents,
    removeEvents
}