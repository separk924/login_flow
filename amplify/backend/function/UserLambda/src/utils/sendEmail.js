const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const Notifications = require('../models/notificationModel.js');
const Users = require('../models/userModel.js');
const connectDB = require('../db/connectDB.js');

dotenv.config();

const sendSuperAdminEmail = async () => {
  await connectDB();
  const people = await Notifications.find({
    email: { $in: ["seungp123@gmail.com", "jfblatteis@blatteisrealty.com"] }
  });

  for (const person of people) {
    for(const notification of person.notifications) {
      // Check if the notification needs to be sent
      if (notification.email_sent === false) {

        var message = "";
        var sub = "";
        if (notification.message.includes("'s account is ready to be verified")) {
          message = `<div style="border: 2px solid black; border-radius: 3px; padding: 40px 20px; text-align: center; width: 80%; height: 100%"><p>${notification.message}<br/><br/> Sign into <a href="https://main.dq930wu46j8zm.amplifyapp.com/">Project Blue Map</a></p></div>`;
          sub = "Account Ready to be Verified";
        }

        const emailOptions = {
            from: process.env.USER_EMAIL,
            to: person.email,
            subject: sub,
            html: message,
        };

        try {
            const result = await lambda.invoke({
              FunctionName: 'EmailLambda-dev',
              InvocationType: 'Event',
              Payload: JSON.stringify(emailOptions)
            }).promise();
          
            console.log("EmailLambda response:", result);
        } catch (error) {
            console.error(`Failed to send email to ${person.email}: `, error);
        }
      }
    }
  }
}

const sendAccountVerifiedEmail = async (email) => {
  await connectDB();
  const person = await Notifications.findOne({ email: email });

  for(const notification of person.notifications) {
    // Check if the notification needs to be sent
    if (notification.email_sent === false) {

      var message = "";
      var sub = "";
      if (notification.message === "Your account has been verified!") {
        message = `<div style="border: 2px solid black; border-radius: 3px; padding: 40px 20px; text-align: center; width: 80%; height: 100%"><p>${notification.message}<br/><br/> Sign into <a href="https://main.dq930wu46j8zm.amplifyapp.com/">Project Blue Map</a></p></div>`;
        sub = "Project Blue Map Account Verification";
      }

      const emailOptions = {
          from: process.env.USER_EMAIL,
          to: person.email,
          subject: sub,
          html: message,
      };

      try {
          const result = await lambda.invoke({
            FunctionName: 'EmailLambda-dev',
            InvocationType: 'Event',
            Payload: JSON.stringify(emailOptions)
          }).promise();
        
          console.log("EmailLambda response:", result);
      } catch (error) {
          console.error(`Failed to send email to ${person.email}: `, error);
      }
    }
  }
}

module.exports = {sendSuperAdminEmail, sendAccountVerifiedEmail};