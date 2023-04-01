import {add_user_channel_function} from "../functions/add_user_channel_function.js";
let interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
let promise = Promise.resolve();

async function main2(client,event) {

  let slack_id = event.user;
   //calling add_user_channel() function
      await add_user_channel_function(slack_id,client);

      return new Promise(function (resolve) {
        setTimeout(resolve, interval);
      })

}


export {main2}
