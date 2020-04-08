import { S3 } from 'aws-sdk';
import { CurrentUser, Get, JsonController, UseBefore } from 'routing-controllers';
import { v1 } from 'uuid';

import { Inject } from 'typedi';
import User from '../entity/User';
import AuthMiddleware from '../middleware/AuthMiddleware';
import { bucket, operations } from './../common/aws/s3';

@UseBefore(AuthMiddleware)
@JsonController('/aws')
export class AwsController {
    constructor(
        @Inject('s3')
        private s3: S3,
    ) {}

    @Get('/s3/signedUrl')
    public S3signedUrl(@CurrentUser() user: User): { signedUrl: string } {
        const key: string = `${user.id}/${v1()}.jpeg`;
        const signedUrl: string = this.s3.getSignedUrl(operations.putObject, {
            Bucket: bucket.images,
            ContentType: 'jpeg',
            Key: key,
        });

        return { signedUrl };
    }
}
