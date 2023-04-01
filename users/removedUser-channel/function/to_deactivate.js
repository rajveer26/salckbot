import {HASURA_OPERATION_delete} from "../../../../queries/users.js";

import  request  from 'graphql-request';
const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
};


async function to_deactivate(variables)
{
  const data = await request(process.env.GRAPHQL_URL,HASURA_OPERATION_delete,variables,headers);

  let slack_id = data['update_leave_user']['returning'][0].slack_id;

  if(data.update_leave_user.affected_rows===1) return slack_id
}


export {to_deactivate}
