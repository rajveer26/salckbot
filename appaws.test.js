let {WebClient} = require("@slack/web-api");

let slack = WebClient;

beforeAll(async () => {
    slack = new WebClient();
});

jest.mock('@slack/web-api', () => {
    return {
        chat: jest.fn(),
        postMessage: jest.fn(),
    };
});

describe('test', () => {
    it("tests slack message", async () => {
        expect(slack.chat.postMessage).toBeCalledWith({...});
    })
})