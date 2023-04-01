import {SQSClient} from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({
  region: "eu-central-1",
  credentials: {
    accessKeyId: "AKIA3POVT2T5PPIGMPN3",
    secretAccessKey: "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",
  },
  endpoint:
    "https://sqs.eu-central-1.amazonaws.com/789111362810/leave-tracker-leave-sync",
});
