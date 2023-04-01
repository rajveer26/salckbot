import { toCheckExistingUser } from "../functions/toCheckExistingUser.js";
jest.mock("graphql-request");
import  request  from "graphql-request";

import {HASURA_OPERATION_get_ID_and_isActive_from_users} from "../../../queries/users.js";

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};
describe("toCheckExistingUser function", () => {
  test("User status becomes active", async () => {
    const variables = { slack_id: "1234"};
    const data = { leave_user:  [{id:24,is_active: true}]  };
    request.mockResolvedValue(data);
    const slack_id = "1234";
    await toCheckExistingUser(variables);
    expect(request).toHaveBeenCalledWith(
      process.env.GRAPHQL_URL,
      HASURA_OPERATION_get_ID_and_isActive_from_users,
      variables,
      headers
    );
  });
  test("logs an error if the adding fails", async () => {
    const variables = { slack_id: "1234"};

    const error = new Error("Failed to fetch data from the server.");
    request.mockRejectedValue(error);
    console.log = jest.fn();
    try {
      await toCheckExistingUser(variables);
    } catch (error) {
      console.log(error);
    }
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
