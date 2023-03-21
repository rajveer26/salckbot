
const { App, AwsLambdaReceiver } = require("@slack/bolt");

const awsLamdaReceiver = new AwsLambdaReceiver({
    signingSecret: '84ff4abd84f90c0d2beb2347ea44a3e4',
});

const app = new App({
    token: 'xoxb-4888345230693-4922933497190-h9W5iPZTp1c0ADTapqqtdBQ6',
    receiver: awsLamdaReceiver,
});


module.exports.handler = async (event, context, callback) => {
    const handler = await awsLamdaReceiver.start();
    return handler(event, context, callback);
};