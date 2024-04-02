import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/jwt/ws.guard';

@WebSocketGateway({ cors: true })
@UseGuards(WsGuard)
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification')
  sendNotification() {
    // Emit an event to all connected clients
    this.server.emit('notification');
  }
}
