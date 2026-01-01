import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
       
        const {accessToken , user ,refreshToken} = await  this.authService.register(registerDto);
        res['cookie']('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false, // true en prod
            sameSite: 'strict',
            path: '/auth/refresh',
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
            sameSite: 'strict',
            path: '/auth/refresh',
        });
        return {
            accessToken, user
        };
    }


    @Post('refresh')
    async refresh(@Req() req: Request) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) throw new Error('No refresh token');

        const payload = this.authService['jwtService'].verify(refreshToken);
        const accessToken =  await this.authService.refresh(payload.sub, refreshToken);
        return accessToken ; 
    }
    const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.jwt_secret,
}