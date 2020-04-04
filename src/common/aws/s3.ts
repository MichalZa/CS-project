import { S3 } from 'aws-sdk';
import { get } from 'nconf';
import { Container } from 'typedi';

export const initS3 = (): void => {
    const config = get('aws');
    const s3: S3 = new S3({
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
    });

    Container.set('s3', s3);
};

export const bucket = {
    images: 'cs-project-s3',
};

export const operations = {
    putObject: 'putObject',
};
