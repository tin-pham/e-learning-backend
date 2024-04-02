import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async canActivate(context: any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw new UnauthorizedException('No token provided');
    }

    const token = bearerToken.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token malformed');
    }

    try {
      const SECRET = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, SECRET) as any;

      if (!decoded.username) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userRepository.findOneByUsername(decoded.username);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      context.switchToWs().getData().user = user;

      return true;
    } catch (ex) {
      console.error('Authentication error:', ex);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
