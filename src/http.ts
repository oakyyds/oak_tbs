import request, { FormData, HttpVerb, Options } from 'sync-request';
import iconv from 'iconv-lite';
import { IncomingHttpHeaders } from 'http';

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
  headers: IncomingHttpHeaders;
  data: unknown;
  cookies?: Array<string>;
};

export function httpCall(option: HttpCallOption): HttpCallResponse {
  let url: string;
  let method: HttpVerb;
  let charset: string;
  let extra: Options = {};
  if (typeof option === 'string') {
    method = 'GET';
    charset = 'utf8';
    url = option;
  } else {
    method = option.method || 'GET';
    url = option.url;
    charset = option.charset || 'utf8';
    if (charset == 'utf-8') {
      charset = 'utf8';
    }
    extra = {
      qs: option.query,
      json: option.json,
      body: option.body ? Buffer.from(option.body) : undefined,
      timeout: (option.timeout || 60) * 1000,
    };
    if (option.form) {
      const form = new FormData();
      for (const key in option.form) {
        form.append(key, option.form[key] as never);
      }
      extra.form = form;
    }
  }
  const resp = request(method, url, extra);
  let body = resp.getBody();
  if (typeof body !== 'string') {
    body = iconv.decode(body, charset);
  }
  try {
    body = JSON.parse(body);
  } catch (_) { /* empty */
  }
  return {
    data: body,
    headers: resp.headers,
    status_code: resp.statusCode,
    url: resp.url,
  };
}
