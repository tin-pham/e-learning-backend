export interface ErrorIndex {
  status: number;
  message: string;
  code?: string;
  actorId?: number | string;
  error?: string;
}

export interface InfoIndex {
  message: string;
  actorId?: number | string;
}

export interface QueryIndex {
  sql: string;
  parameters: unknown[];
}
