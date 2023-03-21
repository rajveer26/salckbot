
const {App, AwsLambdaReceiver} = require("@slack/bolt");
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,

});
const app1 = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    receiver: awsLambdaReceiver,

});
module .exports = {app1};