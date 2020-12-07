import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private tagService: TagService) { }

    @Get()
    async getTags(
        @Res() res: Response
    ) {
        const tags = await this.tagService.getTags();
        return res.json({ ok: true, tags });
    }

    @Post()
    async createTags(
        @Body('tagList') tagList: string[],
        @Res() res: Response
    ) {
        const { foundTags, newTags } = await this.tagService.createTags(tagList);
        return res.json({ ok: true, foundTags, newTags });
    }
}
