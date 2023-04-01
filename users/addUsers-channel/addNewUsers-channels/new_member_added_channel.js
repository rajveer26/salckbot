import { app, awsLamdaReceiver } from "../../../../utils/slackInit.js";
import { main2 } from "./main2.js";
import {isSyncRestricted} from "../../functions/IsSyncRestricted.js";
import {WebClient} from "@slack/web-api";
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  //logLevel: LogLevel.DEBUG
});
app.event('member_joined_channel', async ({event}) => {

const variables={}
  let syncRestricted = await isSyncRestricted(variables)

  if( syncRestricted === true) {
    await main2(client,event);
  }

});



export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
