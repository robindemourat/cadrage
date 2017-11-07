import s3 from 's3';
import secrets from '../config/secret';
const {
  s3BucketName,
  s3AccessKeyId,
  s3SecretAccessKey,
  s3ServerRegion
} = secrets;

const client = s3.createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
      accessKeyId: s3AccessKeyId,
      secretAccessKey: s3SecretAccessKey,
      region: s3ServerRegion,

      endpoint: "https://s3.amazonaws.com"
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    }
});

export default client;

export const Bucket = s3BucketName;
export const ServerRegion = s3ServerRegion;
