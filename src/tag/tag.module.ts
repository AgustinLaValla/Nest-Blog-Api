import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entity/tag.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [TagService],
  controllers: [TagController],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    AuthModule
  ]
})
export class TagModule {}
