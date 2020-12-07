import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateArticleDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    body: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    tagList: string[];
}

