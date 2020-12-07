import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entity/article-entity';
import { Comment } from 'src/entity/comment.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    ) { }

    async findArticleBySlug(slug: string) {
        return await this.articleRepository.findOne({ where: { slug }, relations: ['comments'] });
    }

    async findComment(id: number) {
        return await this.articleRepository.findOne(id);
    }

    async getCommentByAuthor(user:User) {
        return await this.commentRepository.find({ where: { author: user } }); 
    }

    async addComment(body: string, user: User, slug: string) {
        const article = await this.findArticleBySlug(slug);

        const comment = new Comment();
        comment.body = body;
        comment.author = user
        await comment.save();

        article.comments.push(comment);
        await article.save();

        return article;
    }

    async deleteComment(commentId: number, user: User) {
        const comment = await this.commentRepository.findOne(commentId, { relations: ['author'] });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.author.id === user.id) {
            await this.commentRepository.delete(commentId);
        }
    }
}
