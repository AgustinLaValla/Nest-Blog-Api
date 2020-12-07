import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, description: 'email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, description: 'password' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'Password should have at least one Uppercase vowel, one lowercase vowel, one number, and one special character' })
    readonly password: string;
}