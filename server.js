var express = require('express');
const bodyParser = require('body-parser')
const AWS = require('aws-sdk')
var app = express();


// Import resources
const restaurants = require('./restaurants')

// TODO: Set the correct AWS region for your app
AWS.config.update({
  region: "eu-west-1"
  //accessKeyId: 'accessKeyId',
  //secretAccessKey: 'secretAccessKey',
  //endpoint: "http://172.16.123.1:8000/"
});

// Add the plugin to read JSON requests
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// express-healthcheck: respond on /health route for LB checks
app.use('/health', require('express-healthcheck')());

// The DocumentClient class allows us to interact with DynamoDB using normal objects.
// Documentation for the class is available here: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamoDb = new AWS.DynamoDB.DocumentClient()

// API declaration
app.get('/restaurants', function(req, res) {
    restaurants.getRestaurants(null, dynamoDb, function(status, data) {
        res.status(status).json(data)
    })
})


app.listen(5000, function () {
  console.log('Listening on port 5000!');
});
