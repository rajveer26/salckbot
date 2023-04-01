//if x-employee added it will update is_active to true.

import {HASURA_OPERATION_to_activate} from "../../../queries/users.js";
import request from "graphql-request";

const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
};

async function to_activate(variables)
{


    return await request(process.env.GRAPHQL_URL, HASURA_OPERATION_to_activate, variables, headers)


}

export {to_activate}
