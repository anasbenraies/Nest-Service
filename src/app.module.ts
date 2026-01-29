import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt-auth-guard';
import { JwtService } from '@nestjs/jwt';
import { CommentModule } from './comment/comment.module';

// import the modules created here , with the orm config 
@Module({
  imports: [UserModule,TypeOrmModule.forRoot(ormConfig),
    ConfigModule.forRoot({
      isGlobal: true, // very important
    })
  , AuthModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
