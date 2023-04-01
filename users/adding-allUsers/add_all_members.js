import { app, awsLamdaReceiver } from "../../../utils/slackInit.js";

import { main3 } from "./functions/main3.js";
import {isSyncRestricted} from "../functions/IsSyncRestricted.js";
import {WebClient} from "@slack/web-api";
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  //logLevel: LogLevel.DEBUG
});
app.event('app_home_opened', async () => {

  const variables={}
  let syncRestricted = await isSyncRestricted(variables)

  if( syncRestricted === false) {
    await main3(client);
  }
});

export const handler = async (event, context, callback) => {
  const handler = await awsLamdaReceiver.start();
  return handler(event, context, callback);
};
