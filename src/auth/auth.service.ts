import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {


    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<any> {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const userToBeCreated = {
            ...registerDto,
            password: hashedPassword,
        }
        const user = await this.usersService.create(userToBeCreated);

        // const payload: JwtPayload = { sub: user.id, email: user.email };
        const accessToken = await this.generateAccessToken(String(user.id), user.email);
        const refreshToken = await this.generateRefreshToken(String(user.id));

        // save the refresh token to the user's data 
        await this.usersService.addRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: String(user.id),
                email: user.email,
                name: user.name,
            },
        };
    }

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        //const payload: JwtPayload = { sub: String(user.id), email: user.email };
        //const accessToken = await this.jwtService.signAsync(payload);


        const accessToken = await this.generateAccessToken(String(user.id), user.email);
        const refreshToken = await this.generateRefreshToken(String(user.id));

        // save the refresh token to the user's data 
        await this.usersService.addRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: String(user.id),
                email: user.email,
                name: user.name,
            },
        };
    }


    async generateAccessToken(userId: string, email: string) {
        return await this.jwtService.signAsync(
            { sub: userId, email },
            { expiresIn: '15m' },
        );
    }

    async generateRefreshToken(userId: string) {
        return await this.jwtService.signAsync(
            { sub: userId },
            { expiresIn: '7d', secret: process.env.refresh_secret },
        );
    }


    async refresh(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(+userId);

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException();
        }

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) throw new UnauthorizedException();

        return {
            accessToken: await this.generateAccessToken(String(user.id), user.email),
        };
    }

    async validateToken(token: string): Promise<JwtPayload> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async removeRefreshToken(refreshToken: any) {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.refresh_secret,
      });
      const userId = payload.sub ;
      // remove the refresh token of the user that owns the refresh token .
        const removed = await this.usersService.removeRefreshTokenByUserId(userId);
        if (!removed){
           console.log("Refresh token not found / can\'t be removed'")
        }
        console.log("'Refresh token removed'")
    }



}





