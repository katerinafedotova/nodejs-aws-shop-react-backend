const AWS = require('aws-sdk');
const csv = require('csv-parser');

exports.handler = async (event) => {
  // Ensure the event is an S3 event
  if (!event.Records || event.Records.length === 0) {
    console.log('No S3 records found.');
    return;
  }

  // Create S3 service object
  const s3 = new AWS.S3();

  // Process each record in the event
  for (const record of event.Records) {
    // Extract information from the S3 event
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    // Check if the object is in the "uploaded" folder
    if (!key.startsWith('uploaded/')) {
      console.log(`Object "${key}" is not in the 'uploaded' folder. Skipping.`);
      continue;
    }

    console.log(`Processing S3 object: ${key}`);

    // Get the object from S3 as a readable stream
    const s3ObjectStream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();

    // Parse CSV using csv-parser
    s3ObjectStream
      .pipe(csv())
      .on('data', (data) => {
        // Log each record
        console.log('Parsed record:', data);
      })
      .on('end', () => {
        console.log('CSV parsing finished.');
      });
  }
};
