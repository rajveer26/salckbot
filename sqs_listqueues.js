// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'REGION'});

// Create an SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let params = {};

sqs.listQueues(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.QueueUrls);
    }
});
