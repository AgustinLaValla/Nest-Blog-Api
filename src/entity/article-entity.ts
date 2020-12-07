import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import * as slugify from 'slug'
import { User } from "./user.entity";
import { classToPlain } from "class-transformer";
import { Comment } from "./comment.entity";

@Entity('articles')
export class Article extends AbstractEntity {
    @Column()
    slug: string;

    @Column({ type: 'varchar', length: '300', nullable: false })
    title: string

    @Column({ type: 'text', nullable: false })
    description: string

    @Column()
    body: string;

    @Column({ type: 'simple-array', default: [] })
    tagList: string[];

    @ManyToOne(() => User, user => user.articles)
    author: User

    @ManyToMany(() => User, user => user.favorites, { eager: true })
    @JoinTable()
    favoritedBy: User[]

    @Column({ type: 'int', default: 0 })
    favoritesCount: number;

    @OneToMany(() => Comment, comment => comment.article)
    comments: Comment[]

    @BeforeInsert()
    generateSlug() {
        this.slug = slugify(
            this.title,
            { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0
            ).toString();
    }

    toJSON() {
        return classToPlain(this);
    }


    toArticle(user: User) {
        let favorited = null;
        if (user) {
            favorited = this.favoritedBy.includes(user);
        }

        const article: any = this.toJSON();
        delete article.favoritedBy;

        return { ...article, favorited }
    }

}