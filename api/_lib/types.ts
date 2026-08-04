// Minimal request/response typing for Vercel Node serverless functions.
// Avoids depending on @vercel/node (which pulls in a vulnerable transitive
// chain) purely for editor types — the shapes below are all we use.
export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body: any;
  cookies?: Record<string, string>;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: any): void;
  send(body: any): void;
  setHeader(name: string, value: string | string[]): void;
  end(): void;
}

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => Promise<void> | void;
