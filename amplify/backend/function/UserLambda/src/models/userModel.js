const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
        unique: [true, "Email Exists"],
    },
    password: {
        type: String,
        required: [true, "Please enter a valid password"],
        unique: false,
    },
    email_alerts: {
        type: Boolean,
        required: [true],
    },
    first_name: {
        type: String,
        required: [true],
    },
    last_name: {
        type: String,
        required: [true],
    },
    phone_number: {
        type: String,
        required: [false],
    },
    text_alerts: {
        type: Boolean,
        required: [true],
    },
    location_comment_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'locationModel'
    }],
    role: {
        type: String,
        required: [false],
    },
    status: {
        type: String,
        required: [true],
    }
});

module.exports = mongoose.model("Users", UserSchema);

