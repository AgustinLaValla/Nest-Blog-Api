import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from 'dotenv';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload";

config();

const SEED = process.env.SEED;

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SEED
        });
    }

    async validate(jwtPayload: JwtPayload) {
        const { username } = jwtPayload;
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    };

}