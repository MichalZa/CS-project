import { CurrentUser, Get, JsonController, Res, UseBefore } from 'routing-controllers';
import { v1 } from 'uuid';

import User from '../entity/User';
import AuthMiddleware from '../middleware/AuthMiddleware';
import { bucket, operations, s3 } from './../common/aws/s3';

@UseBefore(AuthMiddleware)
@JsonController('/aws')
export class AwsController {

    @Get('/s3/signedUrl')
    public S3signedUrl(@CurrentUser() user: User) {
        const key: string = `${user.id}/${v1()}.jpeg`;
        const signedUrl: string = s3.getSignedUrl(operations.putObject, {
            Bucket: bucket.images,
            ContentType: 'jpeg',
            Key: key,
        });

        return { signedUrl };
    }
}
