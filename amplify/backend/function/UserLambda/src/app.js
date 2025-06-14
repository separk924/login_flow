/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



// Required imports
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./auth.js');
const sendEmail = require('./utils/sendEmail.js')
// Models
const Users = require('./models/userModel.js');
const Notifications = require('./models/notificationModel.js');
// DB
const connectDB = require('./db/connectDB.js');
const mongoose = require("mongoose");


// Database Connection
connectDB();

// Declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

/*********************
* Login Post Request *
**********************/

app.post('/user/login', async function(req, res) {

    const email = req.body.email.trim().toLowerCase();
    
    try {
        const user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        const passwordCheck = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ message: "Passwords do not match" });
        }

        const token = jwt.sign(
            { userId: user.id, userEmail: user.email },
            "RANDOM-TOKEN",
        );

        res.status(200).send({ message: "Login successful", email: user.email, status: user.status, token });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error", err });
    }
});

/****************************
* Registration Post Request *
*****************************/

app.post('/user/consent', async function(req, res) {

    try {
        const updateDoc = {
            $set: {
                email_alerts: req.body.email_consent,
                text_alerts: req.body.text_consent,
                phone_number: req.body.phone_number,
            },
        };
        
        const result = await Users.updateOne({ email: req.body.email }, updateDoc);
        console.log(result);

        const date = new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
            });

        const users = await Users.find({ role: "admin" });
        const bulkWriteOperations = [];
        // const users = await Users.find({ email: "seungp123@gmail.com" });
        for (const user of users) {
            bulkWriteOperations.push({
                updateOne: {
                    filter: { email: user.email },
                    update: { $push: {
                        notifications: {
                            message: `${req.body.email}'s account is ready to be verified`,
                            address: "",
                            availability: "",
                            date: date,
                            opened: false,
                            appeared: false,
                            email_sent: false,
                            text_sent: false,
                            _id: new mongoose.Types.ObjectId(),
                        } } }
                }
            });
        }
        const bulkRes = await Notifications.bulkWrite(bulkWriteOperations);
        await sendEmail.sendSuperAdminEmail();
        console.log(`${bulkRes.modifiedCount} documents updated`);
        res.status(201).send({ message: "User Created Successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error creating user or notifications", err });
    }
  });

/*****************************
* Change Profile Information *
******************************/

app.post('/user/set-profile-info', auth, function(req, res) {

    const email = req.body.email.trim().toLowerCase();
    const filter = {email: email}
    const update = {
        $set: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: email,
            phone_number: req.body.number,
        }
    }

    Users.updateOne(filter, update)
        .then(response => {
            console.log(`Found ${response.matchedCount}. Updated ${response.modifiedCount} user`);
            res.json({ message: "Updated User Profile Successfully." });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Error updating profile information' });
        });
});

/****************************
* Get User Information *
****************************/

app.get('/user/get-user-info', auth, function(req, res) {

    const email = req.query.email.trim().toLowerCase();

    Users.findOne({email: email})
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Error updating user email alerts' });
        });
  });

/****************************
* Get All User Information *
****************************/

app.get('/user/admin/get-all-user-info', auth, function(req, res) {

    Users.find({})
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Error updating user email alerts' });
        });
  });

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda a wrapper is created that will load the app from
// this file
module.exports = app