import { HttpModuleOptions, HttpModuleOptionsFactory, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {

  constructor(
    @Inject(REQUEST)
    private req: Request
  ) {
  }

  createHttpOptions(): HttpModuleOptions {
    const userAgent = this.req.headers['user-agent'];
    const jwtToken = this.req.headers['jwt-token'];
    const defaultUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';
    const options: HttpModuleOptions = {
      headers: {
        'user-agent': userAgent || defaultUserAgent
      }
    };
    if (jwtToken) {
      options.headers['cookie'] = `AuthV1=${jwtToken};`;
    }
    return options;
  }
}
