export interface ErrorIndexException {
  status: number;
  code?: string;
  actorId?: string;
  message: string;
}

export interface InfoIndexException {
  message: string;
}

export interface QueryIndex {
  sql: string;
  parameters: unknown[];
}
