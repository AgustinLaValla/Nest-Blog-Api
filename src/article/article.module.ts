import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entity/article-entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entity/user.entity';
import { CommentsService } from './comments.service';
import { Comment } from 'src/entity/comment.entity';
import { Tag } from 'src/entity/tag.entity';
import { TagService } from 'src/tag/tag.service';

@Module({
  providers: [ArticleService, CommentsService, TagService],
  controllers: [ArticleController],
  imports: [
    TypeOrmModule.forFeature([Article, User, Comment, Tag]),
    AuthModule
  ],
})
export class ArticleModule {}
