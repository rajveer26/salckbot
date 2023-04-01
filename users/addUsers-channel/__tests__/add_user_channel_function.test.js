// Import the function you want to test
import { add_user_channel_function } from '../functions/add_user_channel_function.js';
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import {validMail} from "../../functions/toCheckMail.js";
import {toGetDomain} from "../../functions/toGetDomain.js";
import {getAllUserInfo} from "../functions/togetInfoOfAllUsers.js";
import {to_addData} from "../../functions/addingUserTodb.js";

// Mock the dependencies
jest.mock('../../functions/toCheckMail.js', () => ({
  validMail: jest.fn(() => true),
}));
jest.mock('../../functions/toGetDomain.js', () => ({
  toGetDomain: jest.fn(() => 'example'),
}));
jest.mock('../functions/togetInfoOfAllUsers.js', () => ({
  getAllUserInfo: jest.fn(() => Promise.resolve({
    user: {
      profile: { email: 'john@example.com' },
      real_name: 'John Doe',
      tz: 'Asia/Kolkata',
      team_id: 'T12345678',
    },
  })),
}));
jest.mock('../../functions/memberNotPresent_db.js', () => ({
  memberNotPresent_db: jest.fn(() => Promise.resolve(true)),
}));
jest.mock('../../functions/addingUserTodb.js', () => ({
  to_addData: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../functions/toCheckExistingUser.js', () => ({
  toCheckExistingUser: jest.fn(() => Promise.resolve()),
}));


describe('add_user_channel_function', () => {
  it('should add a user to the database', async () => {
    const slack_id = 'U12345678';
    const client = {WebClient: jest.fn(() => ({users: {info: jest.fn()}}))};

    const expectedData = {
      slack_id:slack_id,
      name: 'John Doe',
      email: 'john@example.com',
      region: 'India',
      external_id: 'T12345678',
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
      created_by: 'bot',
      updated_by: 'bot',
    };

    await add_user_channel_function(slack_id, client);
    const variables={
      slack_id:slack_id
    }
    expect(memberNotPresent_db).toHaveBeenCalledWith(variables);
    expect(validMail).toHaveBeenCalledWith('john@example.com');
    expect(toGetDomain).toHaveBeenCalledWith({});
    expect(to_addData).toHaveBeenCalledWith(expectedData, slack_id, client);
  });

});
