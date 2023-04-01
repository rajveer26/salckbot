
import { main3 } from '../functions/main3.js';
import {getAllUsersFromSlack} from "../functions/getAllUsersFromSlack.js";
import {validMail} from "../../functions/toCheckMail.js";
import {to_validateDomain} from "../../functions/toCheckDomain.js";
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import {to_addData} from "../../functions/addingUserTodb.js";
import {toCheckExistingUser} from "../../functions/toCheckExistingUser.js";


jest.mock('../functions/getAllUsersFromSlack.js', () => ({
  getAllUsersFromSlack: jest.fn().mockResolvedValue([
    {
      id: 'U12345678',
      real_name: 'John Doe',
      tz: 'Asia/Kolkata',
      profile: {
        email: 'johndoe@example.com',
      },
    },
    {
      id: 'U87654321',
      real_name: 'Jane Smith',
      tz: 'America/New_York',
      profile: {
        email: 'janesmith@example.com',
      },
    },
  ]),
}));

jest.mock('../../functions/toCheckMail.js', () => ({
  validMail: jest.fn().mockImplementation((email) => {
    return email.endsWith('@example.com');
  }),
}));

jest.mock('../../functions/toCheckDomain.js', () => ({
  to_validateDomain: jest.fn().mockImplementation((email) => {
    return email.endsWith('example');
  }),
}));

jest.mock('../../functions/addingUserTodb.js', () => ({
  to_addData: jest.fn().mockResolvedValue(),
}));

jest.mock('../../functions/toCheckExistingUser.js', () => ({
  toCheckExistingUser: jest.fn().mockResolvedValue(),
}));

jest.mock('../../functions/memberNotPresent_db.js', () => ({
  memberNotPresent_db: jest.fn().mockImplementation((variables) => {
    return variables.slack_id === 'U12345678';
  }),
}));


describe('main3', () => {
  it('should add valid members to the database', async () => {
    const client = jest.fn();

    await main3(client);

    // expect(client).toHaveBeenCalledTimes(1);
    // expect(client).toHaveBeenCalledWith('1234');

    expect(getAllUsersFromSlack).toHaveBeenCalledTimes(1);
    expect(validMail).toHaveBeenCalledTimes(1);
    expect(to_validateDomain).toHaveBeenCalledTimes(1);
    //expect(memberNotPresent_db).toHaveBeenCalledTimes(1);
   // expect(to_addData).toHaveBeenCalledTimes(1);
    //expect(toCheckExistingUser).toHaveBeenCalledTimes(1);
  });
});
