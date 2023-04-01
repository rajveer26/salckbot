// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-central-1'});

// Create an SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05'});


var params = {
    QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync', /* required */
    AttributeNames: [
        // All | Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy | FifoQueue | ContentBasedDeduplication | KmsMasterKeyId | KmsDataKeyReusePeriodSeconds | DeduplicationScope | FifoThroughputLimit | RedriveAllowPolicy | SqsManagedSseEnabled,
        /* more items */
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        'STRING_VALUE',
        /* more items */
    ],
    //ReceiveRequestAttemptId: 'STRING_VALUE',
    // VisibilityTimeout: 'NUMBER_VALUE',
    // WaitTimeSeconds: 'NUMBER_VALUE'
};
let deleteParams={};
sqs.receiveMessage(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred


    else if (data.Messages) {
        console.log(data);
        console.log(params)
        setTimeout(()=>{
         deleteParams = {
            QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync',
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        },150000)

        // successful response
    }


    sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
            console.log("Delete Error", err);
        } else {
            console.log("Message Deleted", data);
        }
    });

})