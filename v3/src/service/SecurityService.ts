import { ForbiddenError } from 'routing-controllers';

import User from '../entity/User';

export default class SecurityService {
    public denyUnlessGranted(entity: any, user: User): void {
        if (entity.user === undefined || entity.user.id !== user.id) {
            throw new ForbiddenError();
        }
    }
}
