const {App, AwsLambdaReceiver} = require("@slack/bolt");
const {WebClient} = require("@slack/web-api");
const {gql} = require("@apollo/client");
const clients = require("./src/HASURA/conn")
require('dotenv').config();

let AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-central-1'});

// Create an SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
let promise = Promise.resolve();
const {
    HASURA_OPERATION_add,
    HASURA_OPERATION_get_domain,
    HASURA_OPERATION_delete,
    HASURA_OPERATION_get_ID_from_users,
    HASURA_OPERATION_to_activate
} = require("./src/handlers/addUSer/graphQLqueries/graphqueries");

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,

});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    receiver: awsLambdaReceiver,

});



let created_by = "bot";
let external_id = "0";
let updated_by = "bot"
let domain = null;
let domain_config = null;
let is_sync_restricted = '';
let channel_id = null;

(async () => {
    try {
        //to fetch domain and is_sync_restricted from config table.
        const {data} = await clients.query({
            query: gql`${HASURA_OPERATION_get_domain}`, variable: {}
        });

        // for domain
        let result = data['leave_config'][0].domain;
        console.log(result);
        const dom=result.split('.')[0];
        console.log(dom)
        domain_config=dom;

        // for is_sync_restricted
        is_sync_restricted = data['leave_config'][0]['is_sync_restricted']
        console.log(is_sync_restricted);
        if (is_sync_restricted === true) {
            channel_id = data['leave_config'][0]['channel_slack_id'];
            console.log("channel_id " + channel_id)
        }
    }

    catch (error)
    {
        throw error;
    }

})();


app.event('app_home_opened', async ({say},callback,event) => {

    try {

            if (is_sync_restricted === false) {

                //slack API to fetch user details from the slack.
                let {members} = await client.users.list()
                for (const n in members) {

                    //promise chaining
                    promise = promise.then( async function () {
                        let email = members[n].profile.email;

                        //to check if the user is having valid mail id or not
                        if (validMail(email)) {

                            domain = email.split("@")[1];
                            domain = domain.split('.')[0];

                            //checking domain
                            if (domain === domain_config) {

                                let slack_id = members[n].id;

                                //to check member is already present or not
                                if (await member_not_present(callback, event, slack_id) === true) {

                                    console.log(typeof slack_id);
                                    console.log(slack_id)
                                    let name = members[n].real_name;
                                    console.log(typeof name)
                                    let region = members[n].tz;
                                    if (region === 'Asia/Kolkata') region = "India"; else region = "USA"

                                    //after all the checks adding user to the db
                                    addUser_db(slack_id, name, email, region, event, callback, say);
                                }
                                else
                                {
                                    to_activate(slack_id);
                                }

                                return new Promise(function (resolve) {
                                    setTimeout(resolve, interval);
                                })
                            }
                        }
                    });

                }
            }


    } catch (error) {
        await say("oh...there is a glitch let me try again");
        throw error;

    }
    promise.then(function () {
        console.log('Hello talsters');
    })
})


function validMail(mail)
{
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);

}

app.command('/channels', async ({ client,event,say,ack,callback}) => {
    try {
        await ack()
        {

                if (is_sync_restricted === true) {

                    //slack API to get user details from the channel
                    const channel_members = await client.conversations.members({
                        token: process.env.SLACK_BOT_TOKEN,
                        channel: `${channel_id}`
                    });

                    console.log(channel_members.members.length);
                    for (const n in channel_members.members) {

                        //Promise chaining
                        promise = promise.then(function () {
                            let slack_id = channel_members.members[n]
                            //calling add_user_channel() function
                            add_user_channel(slack_id, say,event,callback);

                            return new Promise(function (resolve) {
                                setTimeout(resolve, interval);
                            })
                        });
                    }
                }


        }
    }

    catch (error)
    {
        throw error;
    }
    promise.then(function () {
        console.log('Hello talsters');
    })
});
app.event('member_joined_channel', async ({ event,say,callback}) => {
//use JSON.stringify to send the data

    try {

            if (is_sync_restricted === true) {

                //fetching slack_id
                let slack_id = event.user;
                console.log(slack_id);

                //calling add_user_channel() function
                await add_user_channel(slack_id, say,event,callback);
            }
    }
    catch (error) {
        await say("oh...there is a glitch let me try again");
        throw error;

    }

});
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
 //   logLevel: LogLevel.DEBUG
});

//common function for channel
async function add_user_channel(slack_id,say,event,callback)
{

        if (await member_not_present(callback, event, slack_id) === true) {

            //slack API to fetch users info by passing slack_id
            const info = await client.users.info({
                token: process.env.SLACK_BOT_TOKEN,
                user: `${slack_id}`
            });

            let email = info.user.profile.email;
            console.log(email)

            //to check email is valid or not
            if (validMail(email)) {
                domain = email.split("@")[1];
                domain = domain.split('.')[0];

                //to validate domain
                if (domain === domain_config) {

                    let name = info.user.real_name;

                    let region = info.user.tz;
                    if (region === 'Asia/Kolkata') region = "India"; else region = "USA"

                    await addUser_db(slack_id, name, email, region, event, callback, say);

                } else {
                    console.log("domain mismatched");
                }
            }
        }
        else
        {
            await to_activate(slack_id);
        }
}
//function to add required data into user table.
async function addUser_db(slack_id,name,email,region,event, callback,say) {
    //setTimeout(async () => {
    try {
        //mutation to add user to the db.
        const {data} = await clients.mutate({
            mutation: gql`${HASURA_OPERATION_add}`,

            variables: {
                "slack_id": `${slack_id}`,
                "external_id": `${external_id}`,
                "name": `${name}`,
                "email": `${email}`,
                "region": `${region}`,
                "created_at": new Date().toJSON(),
                "created_by": `${created_by}`,
                "updated_at": new Date().toJSON(),
                "updated_by": `${updated_by}`
            }
        });

        const response = {
            statusCode: 200,

            body: JSON.stringify({data}),
        };
        let id = data['insert_leave_user']['returning'][0].id;
        console.log(id)
        if(callback)
            callback(null, response);
        JSON.parse(response.body);
        await console.log(response.body);
        await saying(slack_id,name, say);


        //pushing data into the queue.
        sendDetails(id,created_by,updated_by);
    }
    catch (errors){

            console.log(errors);
            const response = {
                statusCode: 400,
                body: JSON.stringify({error: errors.message}),
            };

            console.log(response);
            if (callback) callback(null, response);

            JSON.parse(response.body);
        }
}


async function saying(name,slack_id,say)
{
    say(`Welcome ${name} to the channel!! \n I'm your leave assistant bot \n just about to open your
leave balance with your slack id ${slack_id}\n`);
}

//function to check member is present or not.
async function member_not_present(callback, event, slack_id)
{
    try {
        const {data} = await clients.query({
            query: gql`${HASURA_OPERATION_get_ID_from_users}`,

            variables: {
                "slack_id": `${slack_id}`
            }
        });

        const response = {
            statusCode: 200,

            body: JSON.stringify({data})
        };
        console.log(response.body);
        return Object.keys(data['leave_user']).length === 0;

    }
    catch (errors)
    {
        console.log(errors);
        const response = {
            statusCode: 400,

            body: JSON.stringify({error: errors.message}),
        };
        JSON.parse(response.statusCode);

    }
}

//to activate user account if user exists

async function to_activate(slack_id)
{
    try {
        const {data} = await clients.mutate({
            mutation: gql`${HASURA_OPERATION_to_activate}`,

            variables: {
                "slack_id": {"_eq": `${slack_id}`}
            }
        });
        const response = {
            statusCode: 200,

            body: JSON.stringify({data})
        };

        await console.log(response.body);

    }

    catch (errors)
    {
        console.log(errors);
        const response = {
            statusCode: 400,

            body: JSON.stringify({error: errors.message}),
        };
        console.log(response);


        JSON.parse(response.body);
        return response.statusCode;
    }
}

//to deactivate user account
async function to_delete_user(slack_id) {
    try {
        const {data} = await clients.mutate({
            mutation: gql`${HASURA_OPERATION_delete}`,

            variables: {
                "slack_id": {"_eq": `${slack_id}`}
            }
        });
        const response = {
            statusCode: 200,

            body: JSON.stringify({data})
        };

        await console.log(response.body);

    }

    catch (errors)
    {
        console.log(errors);
        const response = {
            statusCode: 400,

            body: JSON.stringify({error: errors.message}),
        };
        console.log(response);


        JSON.parse(response.body);
        return response.statusCode;
    }
}

app.event('member_left_channel', async ({event,callback}) => {

    try{

        let slack_id = event.user;

        if(await member_not_present(callback, event, slack_id)===false)
        {
            console.log("deleting user")
            await to_delete_user(slack_id);
        }

        else
        {
            console.log("user does not exists")
        }

    }
    catch (errors) {
        throw errors;
    }
})
//pushing the data into queue
let sendDetails = function (id,created_by,updated_by) {

    let queue_body=
        {
            id:`${id}`,
            created_by: `${created_by}`,
            updated_by: `${updated_by}`,
            created_at: new Date().toJSON()
        }
    let params = {
        DelaySeconds: 10,

        MessageAttributes: {
            id: {
                DataType: "Number",
                StringValue: `${id}`,
            },
            created_by: {
                DataType: "String",
                StringValue: `${created_by}`,
            },
            updated_by: {
                DataType: "String",
                StringValue: `${updated_by}`,
            },
            created_at:{
                DataType:"String",
                StringValue: new Date().toJSON()
            }
        },


        MessageBody: JSON.stringify(queue_body),

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

//module .exports={to_delete_user,addUser_db};

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
};
