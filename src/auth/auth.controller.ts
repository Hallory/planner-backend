
import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto);
		this.authService.addRefreshTokenToResponce(res, refreshToken);

		return response;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(
		@Body() dto: AuthDto,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.register(dto);
		this.authService.addRefreshTokenToResponce(res, refreshToken);

		return response;
	}


  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req:Request,
    @Res({ passthrough: true }) res: Response
  ){
    const refreshTokenFromCookie = req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if(!refreshTokenFromCookie){
      this.authService.removeRefreshTokenToResponce(res);
      throw new UnauthorizedException ('Please provide valid refresh token');
    }

    const {refreshToken, ...response} = await this.authService.getNewTokens(refreshTokenFromCookie);

    this.authService.addRefreshTokenToResponce(res, refreshToken)
    return response;
  }




  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenToResponce(res);
    return { message: 'ok' };
  }
}
