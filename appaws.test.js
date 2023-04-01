const Func = require('./appaws');
const co = require('/src/HASURA/conn')
const schema = require('/src/HASURA/GraphQL_queries/queries')
//jest.mock('src/HASURA/conn')

describe('test', () => {

    it('tests slack message', async () => {
        expect(Func.to_check_member_present("U04SWUGGWTA")).toBe(true);
    });
});








describe(`Checking user`,()=> {  //If we want to run the method before or after specific test then we have to use describe.
    test(`User is present or not`, () => {
        const slack_id = 'U04SWUGGWTA';
        let callback;

        expect(Func.to_check_member_present(slack_id)).toHaveProperty("data.leave_user[0]");
    },10000);

});
