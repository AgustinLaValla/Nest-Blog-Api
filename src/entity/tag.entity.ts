import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract-entity';
import { classToPlain } from 'class-transformer';

@Entity({ name:'tags' })
export class Tag extends AbstractEntity {
    @Column()
    tag: string;

    toJSON() {
        return classToPlain(this);
    }
}