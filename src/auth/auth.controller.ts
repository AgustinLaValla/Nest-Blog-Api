import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';

@Controller('users')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post()
    @ApiCreatedResponse({ description: 'User Registration' })
    @ApiBody({type: RegisterDto})
    async register(
        @Body(ValidationPipe) credentials: RegisterDto,
        @Res() res: Response
    ): Promise<Response> {
        const { user } = await this.authService.register(credentials);
        return res.json({ ok: true, message: 'User successfully created', user });
    }

    @Post('/login')
    @ApiCreatedResponse({ description: 'User Login' })
    @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
    @ApiBody({type: LoginDto})
    async login(
        @Body(ValidationPipe) credentials: LoginDto,
        @Res() res: Response
    ): Promise<Response> {
        const { user } = await this.authService.login(credentials);
        return res.json({ ok: true, user });
    }
}
