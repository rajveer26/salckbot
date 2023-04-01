// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-central-1'});

// Create an SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let bod={
    name:"rajveer"
}
let sendDetails = function () {
    let params = {
        // Remove DelaySeconds parameter and value for FIFO queues
        DelaySeconds: 10,

        MessageBody: JSON.stringify(bod),
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync'
    };

    sqs.sendMessage(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
            console.log(data);
            console.log(params);
        }
    });
};
sendDetails();