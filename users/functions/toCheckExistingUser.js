//if x-employee added it will update is_active to true.

import {HASURA_OPERATION_get_ID_and_isActive_from_users} from "../../../queries/users.js";
import request from "graphql-request";
import {to_activate} from "./to_activate.js";
const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
};

 async function toCheckExistingUser(variables)
{
  const data = await request(process.env.GRAPHQL_URL,HASURA_OPERATION_get_ID_and_isActive_from_users,variables,headers);

  let id = data['leave_user'][0].id;
  let is_active = data['leave_user'][0].is_active;

  if(is_active===false)
  {
    const variables={
      _eq: id
    }
    await to_activate(variables)
  }

}

export {toCheckExistingUser}
