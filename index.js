const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

// create express server
const app = express();

// connection database
dbConnection();

// cors
app.use( cors() );

// public folder
app.use( express.static('public') );

// read parse
app.use( express.json() );

// rutes
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/events', require('./routes/events') );

// listen request
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en ${ process.env.PORT }`);
});