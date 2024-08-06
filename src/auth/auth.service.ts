import { UserService } from './../user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1;
    REFRESH_TOKEN_NAME = 'refreshToken';
    
    constructor(
        private readonly jwt: JwtService,
        private readonly userService: UserService
    ) {}
    
    async login(dto: AuthDto) {
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = await this.validateUser(dto); 
        const tokens = this.issueTokens(user.id); 

        return {
            user, 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken 
        };
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email);
        
        if (oldUser) throw new NotFoundException('User already exists');

        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = await this.userService.create(dto);
        const tokens = this.issueTokens(user.id); 

        return {
            user, 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken 
        };
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken);
        if (!result) throw new NotFoundException('Please provide valid refresh token');
        
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = await this.userService.getById(result.id);
        const tokens = this.issueTokens(user.id); 

        return {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken 
        };
    }

    private issueTokens(userId: string) {
        const data = { id: userId };

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h', 
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d', 
        });

        return { accessToken, refreshToken };
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email);

        if (!user) throw new NotFoundException('User not found');

        const isValid = await verify(user.password, dto.password);

        if (!isValid) throw new NotFoundException('Invalid password');
        return user;
    }

    addRefreshTokenToResponce(res: Response, refreshToken: string) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: expiresIn,
            secure: true,
            sameSite: 'none'
        });
    }

    removeRefreshTokenToResponce(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(0),
            secure: true,
            sameSite: 'none'
        });
    }
}
