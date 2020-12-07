import { Controller, Delete, Get, Param, Put, Res, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from 'src/auth/user-decorator';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService) { }

    @Get('/:username')
    async getProfileByUsername(
        @Param('username') username: string,
        @Res() res: Response
    ) {
        const user = await this.userService.findUserByName(username);
        return res.json({ ok: true, profile: user });
    }

    @Put('/:username/follow')
    @UseGuards(AuthGuard('jwt'))
    async followUser(
        @Param('username') username: string,
        @GetUser() currentUser: User,
        @Res() res: Response
    ) {
        const user = await this.userService.followUser(currentUser, username);
        return res.json({ ok: true, user });
    }

    @Delete('/:username/follow')
    @UseGuards(AuthGuard('jwt'))
    async unFollowUser(
        @Param('username') username: string,
        @GetUser() currentUser: User,
        @Res() res: Response
    ) {

        const user = await this.userService.unFollowUser(currentUser, username);
        return res.json({ ok: true, user });
    }
}
