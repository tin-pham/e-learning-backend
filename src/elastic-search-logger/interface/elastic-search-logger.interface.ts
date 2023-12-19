export interface ErrorLevelException {
  status: number;
  code?: string;
  actor?: string;
  message: string;
}

export interface InfoLevelException {
  message: string;
}
