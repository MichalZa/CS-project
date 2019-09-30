import { S3 } from 'aws-sdk';
import * as config from 'nconf';

export const s3 = new S3({
    accessKeyId: config.get('aws').s3.accessKeyId,
    secretAccessKey: config.get('aws').s3.secretAccessKey,
});

export const bucket = {
    images: 'cs-project-s3',
};

export const operations = {
    putObject: 'putObject',
};
