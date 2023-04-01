import { app, awsLamdaReceiver } from "../../../../utils/slackInit.js";
import { main1 } from "./main1.js";
import {isSyncRestricted} from "../../functions/IsSyncRestricted.js";
import {WebClient} from "@slack/web-api";
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  //logLevel: LogLevel.DEBUG
});
app.command("/channels", async ({ ack, body,event,say,callback }) => {
  await ack();
  let variables={}
  let syncRestricted = await isSyncRestricted(variables)
  if( syncRestricted === true)
    await main1(client);
});

export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
