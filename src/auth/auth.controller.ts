import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { API, IRequestWithUser, Public } from '../common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

const { TAGS, CONTROLLER, SIGNIN } = API.AUTH;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: SIGNIN.OPERATION })
  @UseGuards(LocalAuthGuard)
  @Post(SIGNIN.ROUTE)
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }
}
