//fetching domain from config table and returning it

import request from "graphql-request";
import {TO_GET_DOMAIN} from "../../../queries/config.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};


async function toGetDomain(variables) {
  const data = await request(process.env.GRAPHQL_URL, TO_GET_DOMAIN, variables, headers);
  let result = data['leave_config'][0].domain;
  return result.split('.')[0];

}

export {toGetDomain}
