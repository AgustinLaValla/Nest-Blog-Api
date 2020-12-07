import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    @InjectRepository(User) private userRepository: Repository<User>

    async findUserByName(username: string) {
        const user = await this.userRepository.findOne({ where: { username }, relations: ['followers'] });
        if (!user) throw new NotFoundException('User Not Found');

        return user;
    }

    async updateUser(body: UpdateUserDto, userId: number) {
        await this.userRepository.update(userId, { ...body });
        return await this.userRepository.findOne({ where: { id: userId } })
    }

    async followUser(currentUser: User, username: string) {

        const user = await this.userRepository.findOne({
            where: { username }, relations: [
                'followers'
            ]
        });

        await user.followers.push(currentUser);
        await this.userRepository.save(user);
        return user.toProfile(currentUser);

    }

    async unFollowUser(currentUser: User, username: string) {

        const user = await this.userRepository.findOne({ where: { username }, relations: ['followers'] });
        user.followers = user.followers.filter(follower => follower !== currentUser)
        await user.save();
        return await user.toProfile(currentUser)

    }
}

