import { Body, Controller, Get, Put, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from 'src/auth/user-decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    async getUserByName(
        @GetUser() reqUser:IUser,
        @Res() res: Response
    ) {
        const user = await this.userService.findUserByName(reqUser.username);
        return res.json({ ok: true, user });
    }

    @Put()
    async updateUser(
        @GetUser() reqUser: IUser,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @Res() res: Response
    ) {
        const user = await this.userService.updateUser(updateUserDto, reqUser.id);
        return res.json({ok: true, user});
    }
}
