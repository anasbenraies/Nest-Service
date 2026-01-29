import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private jwtService: JwtService,
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {

        const { accessToken, user, refreshToken } = await this.authService.register(registerDto);
        res['cookie']('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false, // true en prod
            sameSite: 'lax',
            path: '/',
        });
        return {
            accessToken, user
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {

        const { accessToken, refreshToken, user } =
            await this.authService.login(loginDto);

        res['cookie']('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false, // true en prod
            sameSite: 'lax',
            path: '/',
        });
        return {
            accessToken, user
        };
    }


    @Post('refresh')
    async refresh(@Req() req: Request) {
        const refreshToken = req.cookies?.refresh_token;
        console.log("refresh token retreived from cookie : " + refreshToken);
        if (!refreshToken) throw new Error('No refresh token');

        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.refresh_secret
        });
        const accessToken = await this.authService.refresh(payload.sub, refreshToken);
        console.log("the id of the user is : " + payload.sub);
        return accessToken;
    }


    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) throw new Error('No refresh token');

        // Remove token from DB
        await this.authService.removeRefreshToken(refreshToken);

        // Clear cookie in browser
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false, // true in production
            sameSite: 'lax',
            path: '/',     // make sure matches cookie path
        });

        return { message: 'Logout successful' };
    }


}