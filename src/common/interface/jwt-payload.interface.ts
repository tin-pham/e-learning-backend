export interface IJwtPayload {
  userId: number;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
}
