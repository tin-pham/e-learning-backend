import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API, IRequestWithUser, Public } from '../common';
import { LocalGuard } from './local/local.guard';
import { JwtRefreshTokenGuard } from './jwt/jwt-refresh-token.guard';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/auth.dto';

const { TAGS, CONTROLLER, SIGNIN, REFRESH_TOKEN } = API.AUTH;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: SIGNIN.OPERATION })
  @ApiBody({ type: SignInDTO })
  @UseGuards(LocalGuard)
  @Post(SIGNIN.ROUTE)
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @ApiOperation({ summary: REFRESH_TOKEN.OPERATION })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtRefreshTokenGuard)
  @Post(REFRESH_TOKEN.ROUTE)
  async refreshToken(@Req() req: IRequestWithUser) {
    return this.authService.refreshAccessTokenByUser(req.user);
  }
}
