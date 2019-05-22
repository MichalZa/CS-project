import { EntityRepository, Repository } from "typeorm";
import Comment from "../entity/Comment";

@EntityRepository(Comment)
export default class CommentRepository extends Repository<Comment> {
    
    public getAllWithAuthors() {
        return this.createQueryBuilder('c')
            .leftJoin('user', 'u', 'c.user = u.id')
            .select(['c.id, c.content', 'c.createdAt', 'c.updatedAt'])
            .addSelect('u.name', 'author')
            .execute();
    }
}