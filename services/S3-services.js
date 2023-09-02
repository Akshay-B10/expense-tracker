const AWS = require("aws-sdk");

exports.uploadToS3 = async (fileName, data) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    
    const s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    });
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: "public-read"
    };
    try {
        return new Promise((res, rej) => {
            s3Bucket.upload(params, (err, file) => {
                if (err) {
                    rej("Something went wrong");
                }
                res(file.Location);
            });
        });
    } catch (err) {
        console.log(err);
        throw (err);
    }
};