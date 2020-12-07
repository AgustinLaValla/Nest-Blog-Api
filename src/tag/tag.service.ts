import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entity/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag) private tagRepository: Repository<Tag>
    ) { }

    async getTags() {
        return this.tagRepository.find();
    }

    async createTags(tagList: string[]) {
        const foundTags = await this.tagRepository.find({ where: tagList.map(tag => ({ tag: tag.toLowerCase() })) });
        const newTags = tagList.filter(tag => {
            const exist = foundTags.find(t => t.tag === tag.toLowerCase());
            if(!exist) {
                return tag;
            }
        });

        newTags.map( async tag => {
            const newTag = await this.tagRepository.create({tag: tag.toLowerCase()});
            await newTag.save();
        });
        return { foundTags, newTags };
    }
}
