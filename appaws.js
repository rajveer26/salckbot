const {App, AwsLambdaReceiver} = require("@slack/bolt");
const {WebClient, LogLevel} = require("@slack/web-api");
const {gql} = require("@apollo/client");
const clients = require("./src/HASURA/conn")
require('dotenv').config();

let interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
let promise = Promise.resolve();
let datetime = new Date().toJSON();
const {
    HASURA_OPERATION_add,
    HASURA_OPERATION_get_domain,
    HASURA_OPERATION_delete
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


// //let {result}=null;
let created_at = datetime;
let created_by = "bot";
let email = null;
let external_id = "78787";
let slack_id = null;
let updated_at = datetime;
let updated_by = "bot"
let region = null;
let name = null;
let is_active = false;
let domain1 = null;
let domain_config = null;
let is_sync_restricted = '';
let channel_id = null;

(async () => {
    try {
        const {data, errors} = await clients.query({
            query: gql`${HASURA_OPERATION_get_domain}`, variable: {}
        });
        if (errors) throw errors;
        else {
            let result = data.leave_config[0].domain;
            console.log(result);
            console.log(typeof result);
            //for talview


            const dom=result.split('.')[0];
            console.log(dom)
           domain_config=dom;
            is_sync_restricted = data.leave_config[0].is_sync_restricted
            console.log(is_sync_restricted);
            console.log(typeof is_sync_restricted)

            //domain_config = result.substring(0,8);
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            //console.log(domain_config)
             if (is_sync_restricted === true) {
                channel_id = data.leave_config[0].channel_slack_id;
                console.log("channel_id " + channel_id)
            }
        }
    }
    catch (error)
    {
        throw error;
    }

})();


//console.log("hello")
app.event('app_home_opened', async ({event,say,callback}) => {
    //  await ack();
    // {
    try {
        setTimeout(async () => {

            if (is_sync_restricted === false) {

                console.log("hasuraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")


                let {members} = await client.users.list()
                console.log(members);
                console.log(members.length);

                for (const n in members) {
                    promise = promise.then( function () {
                        console.log(members[n].profile.email);
                        email = members[n].profile.email;
                        if (email == null) email = "12345@12345";

                        let domai = email.split("@")[1];
                        console.log(domai);
                       // domain1 = domai.substring(0, 4);
                         domain1=domai.split('.')[0];
                        console.log(domain1)
                        console.log("ddddddddddddddddddddddddddddddddddddoooooooooooooooooooooommmmmmmmmm")
                        console.log(domain1)
                        if (domain1 == domain_config) {

                            slack_id = members[n].id;
                            console.log(typeof slack_id);
                            console.log(slack_id)

                            console.log("####################################################################")
                            name = members[n].real_name;
                            console.log(typeof name)
                            let tzz = members[n].tz;
                            if (tzz === 'Asia/Kolkata') region = "India"; else region = "USA"
                            console.log("region " + typeof region);

                             addUser_db(event, callback, say);
                        }

                        return new Promise(function (resolve) {
                            setTimeout(resolve, interval);
                        })
                    });

                }
            }
        }, 10000);

    } catch (error) {
        await say("ohoo...there is a glitch let me try again");
        throw error;

    }
    promise.then(function () {
        console.log('Loop finished.');
    })
})



app.command('/channels', async ({ client,event,say,ack}) => {
    try {
        await ack()
        {
                console.log("channnnnelll");
                setTimeout(async () => {

                    if (is_sync_restricted === true) {

                        console.log("channel user");
                        const channel_members = await client.conversations.members({
                            token: process.env.SLACK_BOT_TOKEN,
                            channel: `${channel_id}`
                        });
                        console.log(channel_members.members);
                        console.log(channel_members.members.length);
                        for (const n in channel_members.members) {
                            promise = promise.then(function () {

                                console.log(channel_members.members[n])
                                add_user_channel(channel_members.members[n], say);

                                return new Promise(function (resolve) {
                                    setTimeout(resolve, interval);
                                })
                            });
                        }
                    }
                }, 1000);

            }
        }

catch (error)
{
    throw error;
}
    promise.then(function () {
        console.log('Loop finished.');
    })
});
app.event('member_joined_channel', async ({ client,  event,say}) => {
//use JSON.stringify to send the data

    try {


            setTimeout(async () => {

                 if (is_sync_restricted === true) {

                     console.log("ok");
                     console.log(event);

                     slack_id = event.user;
                     console.log(slack_id);
                     await add_user_channel(slack_id, say);
                 }

            }, 10000);

     }
    catch (error) {
        await say("ohoo...there is a glitch let me try again");
        throw error;

    }

});
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    //logLevel: LogLevel.DEBUG
});

async function add_user_channel(slac_id,say)
{
        setTimeout(async () => {
   slack_id = slac_id;
    const info = await client.users.info({
        token: process.env.SLACK_BOT_TOKEN,
        user: `${slack_id}`
    });
    // console.log(event);

    email = info.user.profile.email;
    console.log(email)
    let domai = email.split("@")[1];
    console.log(domai);
    domain1 = domai.substring(0, 4);
    //console.log("ddddddddddddddddddddddddddddddddddddoooooooooooooooooooooommmmmmmmmm")
    console.log(domain1)
    if (domain1 === domain_config) {
        console.log(" equal");

            console.log(info.user);

            name = info.user.real_name;

            let tzz = info.user.tz;
            if (tzz === 'Asia/Kolkata') region = "India"; else region = "USA"
            console.log("region " + typeof region);

               await addUser_db(null,null,say);
            //await resolve(adding_user);



    }
    else
    {
        console.log("domain mismatched");
    }
        }, 1000);


}
//function to add required data into user table.
async function addUser_db(event, callback,say) {
    //setTimeout(async () => {
    try {

            const {data, errors} = await clients.mutate({
                mutation: gql`${HASURA_OPERATION_add}`,

                variables: {
                    "slack_id": `${slack_id}`,
                    "external_id": `${external_id}`,
                    "name": `${name}`,
                    "email": `${email}`,
                    "region": `${region}`,
                    "created_at": `${created_at}`,
                    "created_by": `${created_by}`,
                    "updated_at": `${updated_at}`,
                    "updated_by": `${updated_by}`,
                    "is_active": `${is_active}`
                }
            });
            if (errors) {
                console.log(errors);
                const response = {
                    statusCode: 400,

                    body: JSON.stringify({error: errors.message}),
                };
                console.log(response);
                if (callback) callback(null, response);

                JSON.parse(response.body);
                return response.statusCode;
            } else {
                 console.log(name);
                 console.log(slack_id);

                const response = {
                    statusCode: 200,

                    body: JSON.stringify({data})
                };
                //console.log("vvvvvvvvvvvvv888888888888888888888888888888888888888888888888888")

                await console.log(response.body);

                //push_data_into_sqs();
                  say(`Welcome ${name} to the channel!! \n I'm your leave assistant bot \n just about to open your
leave balance with your slag id ${slack_id}\n`);


                if (callback) callback(null, response);
                //return true;
            }



    }
    catch (errors){
        if(errors.graphQLErrors[0].message.includes('Uniqueness violation. duplicate key value violates unique constraint "user_pk"'))
            console.log("user already exists");
        //throw errors;
       // return false;

    }
   // }, 5000);

}


app.event('member_left_channel', async ({event,say,callback}) => {

    try{

        slack_id = event.user;

        const {data, errors} = await clients.mutate({
            mutation: gql`${HASURA_OPERATION_delete}`,

            variables: {
                "slack_id": `${slack_id}`
            }
        });
        if (errors) {
            console.log(errors);
            const response = {
                statusCode: 400,

                body: JSON.stringify({error: errors.message}),
            };
            console.log(response);
            if (callback) callback(null, response);

            JSON.parse(response.body);
            return response.statusCode;
        } else {

            const response = {
                statusCode: 200,

                body: JSON.stringify({data})
            };
            //console.log("vvvvvvvvvvvvv888888888888888888888888888888888888888888888888888")

            await console.log(response.body);
            if (callback) callback(null, response);
            //return true;
        }



    }
    catch (errors) {
  throw errors;
    }
})

// function push_data_into_sqs(){
//
//
// }


module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
};
