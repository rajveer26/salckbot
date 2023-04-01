import {
  validMail
} from "../functions/toCheckMail.js";

describe("Get true validation upon sending mail", () => {
  test("getSubscribersFromString should return an array of users", () => {
    const string = "1905890@kiit.ac.in";
    const expected = true
    const result = validMail(string);
    expect(result).toEqual(expected);
  });

  test("get false upon sending wrong mail", () => {
    const string = "123"
    const expected = false;
    const result = validMail(string);
    expect(result).toEqual(expected);
  });
});
