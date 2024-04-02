import { Socket } from 'socket.io';
import { IRequestWithUser } from '../common';

export type ISocketUser = Socket & IRequestWithUser;
