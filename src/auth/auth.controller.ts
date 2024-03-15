import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { Response } from 'express';
import { Tokens } from 'src/auth/types/interface';
import { Cookie } from 'lib/common';

const REFRESH_TOKEN = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login-user')
  async loginUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const tokens = await this.authService.loginUser(userDto);
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Post('/login-company')
  async loginCompany(
    @Body() companyDto: CreateCompanyDto,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.loginCompany(companyDto);
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Post('/registration-user')
  registrationUser(@Body() userDto: CreateUserDto) {
    return this.authService.registrationUser(userDto);
  }

  @Post('/registration-company')
  registrationCompany(@Body() companyDto: CreateCompanyDto) {
    return this.authService.registrationCompany(companyDto);
  }

  @Get('refresh-token')
  async refreshTokens(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.refreshTokens(refreshToken);
    if (!tokens) {
      throw new UnauthorizedException();
    }
    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException('');
    }
    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.expiresIn),
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({
      accessToken: tokens.accessToken,
    });
  }
}
