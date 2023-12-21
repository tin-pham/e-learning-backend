export interface ErrorIndex {
  status: number;
  message: string;
  code?: string;
  actorId?: string;
  error?: string;
}

export interface InfoIndex {
  message: string;
  actorId?: string;
}

export interface QueryIndex {
  sql: string;
  parameters: unknown[];
}
