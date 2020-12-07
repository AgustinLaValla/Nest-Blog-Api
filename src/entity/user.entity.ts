import { classToPlain, Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, Unique } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { hashSync, genSaltSync, compare } from 'bcryptjs';
import { InternalServerErrorException } from "@nestjs/common";
import { Article } from "./article-entity";
import { Comment } from "./comment.entity";

@Entity('users')
@Unique(['username', 'email'])
export class User extends AbstractEntity {

    @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    @IsEmail()
    email: string;


    @Column({ type: 'varchar', length: 200, nullable: false })
    @Exclude()
    password: string

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true, default: '' })
    image: string | null;

    @ManyToMany(() => User, user => user.followee)
    @JoinTable()
    followers: User[];

    @ManyToMany(() => User, user => user.followers)
    @JoinTable()
    followee: User[];

    @OneToMany(() => Article, article => article.author)
    articles: Article[];

    @ManyToMany(() => Article, article => article.favoritedBy)
    favorites: Article[];

    @OneToMany(() => Comment, comment => comment.author, { eager: false })
    comments: Comment[] 

    @BeforeInsert()
    hashPassoword() {
        const salt = genSaltSync(10);
        this.password = hashSync(this.password, salt);
    }

    toJSON() {
        return classToPlain(this)
    }

    async verifyPassword(password: string) {
        try {
            return await compare(password, this.password);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    toProfile(user: User) {
        const following = this.followers.includes(user);
        const profile: any = this.toJSON();
        delete profile.followers;
        return { ...profile, following }
    }
}