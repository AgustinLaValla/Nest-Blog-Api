import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { LoginDto } from "./login.dto";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto extends LoginDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty({ type: String, description: 'Username' })
    readonly username: string;
}