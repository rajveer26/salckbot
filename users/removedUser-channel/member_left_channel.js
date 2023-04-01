import { app, awsLamdaReceiver } from "../../../utils/slackInit.js";

import {memberNotPresent_db} from "../functions/memberNotPresent_db.js";
import {to_deactivate} from "./function/to_deactivate.js";

app.event('member_left_channel', async ({event,callback}) => {

  let slack_id = event.user;
  const variables={
    slack_id:slack_id
  }
  let memberNotPresent = await memberNotPresent_db(variables)
  if ( memberNotPresent === false) {

    console.log("deleting user")
    const variables= {
      slack_id: {_eq: slack_id}
    }
    await to_deactivate(variables);
  }

  else
  {
    console.log("user does not exists")
  }
});


export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
