import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entity/article-entity';
import { FindAllQuery } from 'src/entity/interfaces/find-all-query.interface';
import { FindFeedQuery } from 'src/entity/interfaces/find-feed-query.interface';
import { User } from 'src/entity/user.entity';
import { TagService } from 'src/tag/tag.service';
import { Like, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private tagService: TagService
    ) { }

    async checkTags(tagList: string[]) {
        await this.tagService.createTags(tagList);
    }

    async findBySlug(slug: string) {
        const article = await this.articleRepository.findOne({ where: { slug }, relations: ['author', 'comments'] });
        if (!article) throw new NotFoundException('Article Not Found');
        return article;
    }

    async createArticle(user: User, data: CreateArticleDto) {
        const article = await this.articleRepository.create({ ...data });
        article.author = user;
        await article.save();
        await this.checkTags(data.tagList)
        return article;
    }

    private ensureOwnership(user: User, article: Article): boolean {
        return article.author.id === user.id;
    }

    async updateArticle(slug: string, user: User, data: UpdateArticleDto) {
        const article = await this.findBySlug(slug);
        if (!this.ensureOwnership(user, article)) {
            throw new UnauthorizedException();
        }
        await this.articleRepository.update({ slug }, data);
        return await this.findBySlug(slug);
    }

    async deleteArticle(slug: string, user: User) {
        const article = await this.findBySlug(slug);
        if (!this.ensureOwnership(user, article)) {
            throw new UnauthorizedException();
        }
        await this.articleRepository.remove(article);
    }

    async findAll(user: User, query: FindAllQuery) {
        const findOptions: any = {
            where: {}
        }

        if (query.author) {
            findOptions.where['author.username'] = query.author;
        }

        if (query.favorited) {
            findOptions.where['favoritedBy.username'] = query.favorited;
        }

        if (query.tag) {
            findOptions.where.tagList = Like(`%${query.tag}%`);
        }

        return (await this.articleRepository.find({ ...findOptions })).map(article => article.toArticle(user));
    }

    async findFeed(user: User, query: FindFeedQuery) {
        const { followee } = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['followee']
        });

        const { limit, offset } = query;
        const articles = await this.articleRepository.find({
            take: limit,
            skip: offset,
            where: followee.map(follows => (
                { author: follows.id }
            ))
        });

        return articles.map(article => article.toArticle(user));
    }

    async favoriteArticle(user: User, slug: string) {
        const article = await this.articleRepository.findOne({ where: { slug }, relations: ['favoritedBy'] });
        article.favoritedBy.push(user);
        await article.save();
        return article;
    }

    async unfavoriteArticle(user: User, slug) {
        const article = await this.articleRepository.findOne({ where: { slug } });
        await this.articleRepository.createQueryBuilder().relation(Article, 'favoritedBy').of(article).remove(user);
        return await this.articleRepository.findOne({ where: { slug }, relations: ['favoritedBy'] });
    }
}
