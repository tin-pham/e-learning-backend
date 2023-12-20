export interface ErrorIndex {
  status: number;
  code?: string;
  actorId?: string;
  message: string;
}

export interface InfoIndex {
  message: string;
  actorId?: string;
}

export interface QueryIndex {
  sql: string;
  parameters: unknown[];
}
