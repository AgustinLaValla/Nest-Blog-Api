import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString({each: true})
    @IsNotEmpty()
    tagList: string[];
}
