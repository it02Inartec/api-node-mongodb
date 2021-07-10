const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        mongoose.connect(
            process.env.DB_INFO,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            }
        );

        console.log('Database Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error try connection')
    }
};

module.exports = {
    dbConnection
};