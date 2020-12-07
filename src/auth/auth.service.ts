import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private JwtService: JwtService
    ) { }

    async register(credentials: RegisterDto) {

        const user = await this.userRepository.create({ ...credentials });
        await this.userRepository.save(user);
        const jwtPayload: JwtPayload = { username: user.username, email: user.email, id: user.id }
        const token = await this.JwtService.sign(jwtPayload);
        return { user: { ...user, token } };

    }

    async login({ email, password }: LoginDto) {

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('User not Found');

        const passwordIsValid = await user.verifyPassword(password);

        if (!passwordIsValid) throw new UnauthorizedException('User or password is wrong');

        const jwtPayload: JwtPayload = { username: user.username, email: user.email, id: user.id }
        const token = await this.JwtService.sign(jwtPayload);
        return { user: { ...user, token } };
    }
}
