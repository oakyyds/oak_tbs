export {};

declare global {
  type HttpCallOption = string | {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH';
    // bytes
    body?: Array<number>;
    json?: unknown[] | {
      [key: string]: unknown
    };
    form?: {
      [key: string]: unknown
    };
    query?: {
      [key: string]: string | number | boolean
    };
    headers?: {
      [key: string]: string | number | boolean
    };
    // seconds, eg: 60
    timeout?: number;
    charset?: 'utf-8' | 'gbk' | string;
  };
  type HttpCallResponse = {
    url: string;
    status_code: number;
    content_length?: number;
    headers: { [key: string]: string };
    data: unknown;
    cookies: Array<string>;
  };

  function httpCall(option: HttpCallOption): HttpCallResponse;
}
