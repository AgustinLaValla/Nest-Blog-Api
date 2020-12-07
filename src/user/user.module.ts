import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt-strategy';

@Module({
  providers: [UserService],
  controllers: [UserController, ProfileController],
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule
  ]
})
export class UserModule { }
