import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { API, IRequestWithUser, Public } from '../common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/auth.dto';

const { TAGS, CONTROLLER, SIGNIN } = API.AUTH;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: SIGNIN.OPERATION })
  @ApiBody({ type: SignInDTO })
  @UseGuards(LocalAuthGuard)
  @Post(SIGNIN.ROUTE)
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }
}
