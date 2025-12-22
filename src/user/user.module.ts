import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  
  // use that so that the user repo gets recognized
  imports:[TypeOrmModule.forFeature([User]),
  //th ref to prevent circular imports
  forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService,JwtService],
  exports: [UserService],
})
export class UserModule {}
