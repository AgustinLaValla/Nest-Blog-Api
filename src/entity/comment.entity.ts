import { classToPlain } from "class-transformer";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { Article } from "./article-entity";
import { User } from "./user.entity";

@Entity({ name: 'comments' })
export class Comment extends AbstractEntity {
    @Column()
    body: string;

    @ManyToOne(() => User, user => user.comments, { eager: true })
    author: User

    @ManyToOne(() => Article, article => article.comments)
    article: Article

    toJSON() {
        return classToPlain(this);
    }
}