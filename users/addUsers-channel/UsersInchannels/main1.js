import {getAllUserFromChannel} from "../functions/getUserDetailFromChannel.js";
import {toGetChannel} from "../functions/toGetChannel.js";
import {add_user_channel_function} from "../functions/add_user_channel_function.js";
let interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
let promise = Promise.resolve();
let token = process.env.SLACK_BOT_TOKEN;
 async function main1(client) {
 let variables ={}
 let channel = await toGetChannel(variables);
  const channel_members = await getAllUserFromChannel(channel,client,token);

  for (const n in channel_members.members) {

    //Promise chaining
    promise = promise.then(function () {
      let slack_id = channel_members.members[n]
      //calling add_user_channel() function


      add_user_channel_function(slack_id,client);

      return new Promise(function (resolve) {
        setTimeout(resolve, interval);
      })
    });
  }
}
export {main1}
