import { sendDetails } from '../functions/sqs-triggers/sendDetails.js';
import { sqsClient } from '../functions/sqs-triggers/synSQSinit.js';

// Mock the SQS client
jest.mock('../functions/sqs-triggers/synSQSinit.js', () => ({
  sqsClient: {
    send: jest.fn(),
  },
}));

describe('sendDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call sqsClient.send with the correct params", async () => {
    const id = "123";
    const created_by = "Rajveer";
    const updated_by = "Pratap";

const time = new Date().toLocaleString();
    await sendDetails(id, created_by, updated_by);

    expect(sqsClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          DelaySeconds: 10,
          MessageAttributes: {
            id: {
              DataType: "Number",
              StringValue: id,
            },
            created_by: {
              DataType: "String",
              StringValue: created_by,
            },
            updated_by: {
              DataType: "String",
              StringValue: updated_by,
            },
            created_at: {
              DataType: "String",
              StringValue: time, // update here
            },
          },
          MessageBody: expect.any(String),
          QueueUrl: "https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync",
        },
      })
    );
  });


  it('should log an error if there is a failure', async () => {
    const id = 123;
    const created_by = 'John';
    const updated_by = 'Jane';
    const errorMessage = 'Something went wrong';

    // Throw an error when the SendMessageCommand is called
    sqsClient.send.mockRejectedValueOnce(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, 'log');

    await sendDetails(id, created_by, updated_by);

    expect(consoleSpy).toHaveBeenCalledWith('Error', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
