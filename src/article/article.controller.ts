import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from 'src/auth/user-decorator';
import { User } from 'src/entity/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { FindAllQuery } from 'src/entity/interfaces/find-all-query.interface';
import { FindFeedQuery } from 'src/entity/interfaces/find-feed-query.interface';
import { CommentsService } from './comments.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('article')
export class ArticleController {
    constructor(
        private articleService: ArticleService,
        private commentsService: CommentsService
    ) { }


    @Get('/feed')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async findFeed(
        @GetUser() user: User,
        @Query() query: FindFeedQuery,
        @Res() res: Response
    ) {
        const articles = await this.articleService.findFeed(user, query);
        return res.json({ articles, articlesCount: articles.length });
    }

    
    @Get('/comments')
    @UseGuards(AuthGuard('jwt'))
    async getCommentsByAuthor(
        @GetUser() user: User,
        @Res() res: Response
    ) {
        const comments = await this.commentsService.getCommentByAuthor(user);
        return res.json({ ok: true, comments });
    }

    @Get('/:slug')
    async findArticleBySlug(
        @Param('slug') slug: string,
        @Res() res: Response
    ) {
        const article = await this.articleService.findBySlug(slug);
        return res.json({ ok: true, article });
    }

    @Get()
    @UseGuards(new OptionalJwtAuthGuard())
    async findAll(
        @GetUser() user: User,
        @Query() query: FindAllQuery,
        @Res() res: Response
    ) {
        const articles = await this.articleService.findAll(user, query);
        return res.json({ articles, articlesCount: articles.length });
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createArticle(
        @GetUser() user: User,
        @Body(ValidationPipe) createArticleDto: CreateArticleDto,
        @Res() res: Response
    ) {
        const article = await this.articleService.createArticle(user, createArticleDto);
        return res.json({ ok: true, article, message: 'Article Successfully  created' });
    }

    @Put('/:slug')
    @UseGuards(AuthGuard('jwt'))
    async updateArticle(
        @Param('slug') slug: string,
        @GetUser() user: User,
        @Body(ValidationPipe) updateArticleDto: UpdateArticleDto,
        @Res() res: Response
    ) {
        const article = await this.articleService.updateArticle(slug, user, updateArticleDto);
        return res.json({ ok: true, article, message: 'Article Successfully updated' });
    }

    @Put('/:slug/favorite')
    @UseGuards(AuthGuard('jwt'))
    async favoriteArticle(
        @GetUser() user: User,
        @Param('slug') slug: string,
        @Res() res: Response
    ) {
        const article = await this.articleService.favoriteArticle(user, slug);
        return res.json({ ok: true, message: 'You liked the post', article });
    }

    @Put('/:slug/comment')
    @UseGuards(AuthGuard('jwt'))
    async addComment(
        @GetUser() user: User,
        @Param('slug') slug: string,
        @Body('body') body: string,
        @Res() res: Response
    ) {
        const article = await this.commentsService.addComment(body, user, slug);
        return res.json({ ok: true, message: 'Comment successfully added', article });
    }

    @Delete('/:slug')
    @UseGuards(AuthGuard('jwt'))
    async deleteArticle(
        @GetUser() user: User,
        @Param('slug') slug: string,
        @Res() res: Response
    ) {
        await this.articleService.deleteArticle(slug, user);
        return res.json({ ok: true, message: 'Article Successfully Deleted' });
    }

    @Delete('/:slug/favorite')
    @UseGuards(AuthGuard('jwt'))
    async unfavoriteArticle(
        @GetUser() user: User,
        @Param('slug') slug: string,
        @Res() res: Response
    ) {
        const article = await this.articleService.unfavoriteArticle(user, slug);
        return res.json({ ok: true, message: 'Article unliked', article });
    }

    @Delete('/:id/comment')
    @UseGuards(AuthGuard('jwt'))
    async deleteComment(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) commentId: number,
        @Res() res: Response
    ) {
        await this.commentsService.deleteComment(commentId, user);
        return res.json({ ok: true, message: 'Comment Successfully Deleted' });
    }
}

