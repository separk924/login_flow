const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const bcrypt = require('bcryptjs');
// Models
const Users = require('./models/userModel.js');
const Notifications = require('./models/notificationModel.js');
// DB
const connectDB = require('./db/connectDB.js');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event, context) => {

  // try{
  //   bcrypt.hash(req.body.password.trim(), 10)
  //       .then(hashedPassword => {
  //           const user = new Users({
  //               email: req.body.email.trim().toLowerCase(),
  //               password: hashedPassword,
  //           });

  //           user.save()
  //               .then(result => {
  //                   const notification = new Notifications({
  //                       email: req.body.email.trim().toLowerCase(),
  //                       notifications: [],
  //                       email_alerts: true,
  //                   });
  //                   notification.save()
  //                       .then(() => res.status(201).send({ message: "User Created Successfully", result }))
  //                       .catch(err => res.status(500).send({ message: "Error creating user's notifications", err }));
  //               })
  //               .catch(err => res.status(500).send({ message: "Error creating user", err }));
  //       })
  //       .catch(err => res.status(500).send({ message: "Password was not hashed successfully", err }));
  // } catch(err){
  //   console.error('Error in handler:', err);
  //   console.log('Failed to register.');
  // }
  

  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
