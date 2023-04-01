const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
};
import {HASURA_OPERATION_get_ID_and_isActive_from_users} from "../../../queries/users.js";
import request from "graphql-request";


async function memberNotPresent_db(variables) {
  const data = await request(process.env.GRAPHQL_URL, HASURA_OPERATION_get_ID_and_isActive_from_users, variables, headers);

  return Object.keys(data['leave_user']).length === 0;

}

export {memberNotPresent_db}
