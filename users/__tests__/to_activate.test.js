import { to_activate } from "../functions/to_activate.js";
jest.mock("graphql-request");
import request  from "graphql-request";

import {HASURA_OPERATION_to_activate} from "../../../queries/users.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};
describe("to_activate function", () => {
  test("User status becomes active", async () => {
    const variables={
      _eq: 24
    }
const data = { update_leave_user: {affected_rows:1,returning:[{is_active: true,slack_id: "1234"}]  }};
    request.mockResolvedValue(data);
    const slack_id = "1234";
    await to_activate(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      HASURA_OPERATION_to_activate,
      variables,
      headers
    );
  });
  test("logs an error if the adding fails", async () => {
    const variables={
      _eq: 24
    }
    const error = new Error("Failed to fetch data from the server.");
    request.mockRejectedValue(error);
    console.log = jest.fn();
    try {
      await to_activate(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
