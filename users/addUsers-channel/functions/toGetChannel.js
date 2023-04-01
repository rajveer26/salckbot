//fetching channel id from config table and returning it

import {HASURA_OPERATION_get_channel} from "../../../../queries/config.js";
import request from "graphql-request";

const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
};
async function toGetChannel(variables) {
  const data = await request(process.env.GRAPHQL_URL, HASURA_OPERATION_get_channel, variables, headers);
  return data['leave_config'][0]['channel_slack_id'];
}

export {toGetChannel}
