const { handler } = require("../lambdas/importProductsFile");
const AWS = require("aws-sdk-mock");
const mockedEnv = require("mocked-env");

describe("Lambda Function", () => {
  let restoreEnv: () => void;
  beforeAll(() => {
    // Mock the environment variables
    restoreEnv = mockedEnv({
      BUCKET_NAME: "my-mock-bucket-name",
    });
  });

  afterAll(() => {
    // Restore the original environment variables
    restoreEnv();
  });

  afterEach(() => {
    // Reset all AWS SDK mocks
    AWS.restore();
  });

  it("should return a signed URL", async () => {
    const mockEvent = {
      queryStringParameters: {
        name: "example-file.csv",
      },
    };

    // Mock the getSignedUrl function
    AWS.mock(
      "S3",
      "getSignedUrlPromise",
      (
        operation: string,
        params: any,
        callback: (error: Error | null, url?: string) => void
      ) => {
        callback(null, "https://mock-signed-url");
      }
    );

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);

    const parsedBody = JSON.parse(result.body);

    expect(parsedBody).toMatch(
      /^https:\/\/my-mock-bucket-name\.s3\.amazonaws\.com\/uploaded\/example-file\.csv\?AWSAccessKeyId=[A-Za-z0-9]+&Expires=[0-9]+&Signature=[A-Za-z0-9%]+$/
    );
  });

  it("should handle errors", async () => {
    const mockEvent = {
      queryStringParameters: {
        name: "example-file.csv",
      },
    };

    AWS.mock(
      "S3",
      "getSignedUrlPromise",
      (
        operation: string,
        params: any,
        callback: (error: Error | null, url?: string) => void
      ) => {
        callback(new Error("Internal Server Error"));
      }
    );

    try {
      await handler(mockEvent);
    } catch (error) {
      expect((error as any).statusCode).toBe(500);
      expect(JSON.parse((error as any).body)).toEqual({
        error: "Internal Server Error",
      });
    }
  });
});
