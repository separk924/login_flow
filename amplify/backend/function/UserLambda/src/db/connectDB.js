const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB(){
    // use mongoose to connect this app to our database on mongoDB using the DB_URL
    mongoose.connect(process.env.AUTHDB_URI)

    // Event handling
    mongoose.connection.once('open', () => console.info("MongoDB primary connection opened!"));
    mongoose.connection.on('connected', () => console.info("MongoDB primary connection succeeded!"));
    mongoose.connection.on('error', (err) => {
        console.error("MongoDB primary connection failed, " + err);
        mongoose.disconnect();
    });
    mongoose.connection.on('disconnected', () => console.info("MongoDB primary connection disconnected!"));

    // Graceful exit
    process.on('SIGINT', () => {
        mongoose.connection.close().then(() => {
            console.info("Mongoose primary connection disconnected through app termination!");
            process.exit(0);
        });
    });
}

module.exports = connectDB;