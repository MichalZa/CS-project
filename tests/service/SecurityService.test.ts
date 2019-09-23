import { ForbiddenError } from 'routing-controllers';
import User from '../../src/entity/User';
import SecurityService from '../../src/service/SecurityService';

describe('SecurityService test', () => {
    let securityService: SecurityService;
    let user: User;

    beforeEach(() => {
        securityService = new SecurityService();
        user = new User();
        user.id = 10;
    });

    it('undefined user - should be forbidden', () => {
        const entity = {
            user: undefined,
        };

        expect(() => {
            securityService.denyUnlessGranted(entity, user);
        }).toThrow(ForbiddenError);
    });

    it('incorrect user id - should be forbidden', () => {
        const entity = {
            user: {
                id: 5,
            },
        };

        expect(() => {
            securityService.denyUnlessGranted(entity, user);
        }).toThrow(ForbiddenError);
    });

    it('correct user id - should pass', () => {
        const entity = {
            user: {
                id: user.id,
            },
        };

        expect(() => {
            securityService.denyUnlessGranted(entity, user);
        }).not.toThrow(ForbiddenError);
    });
});
