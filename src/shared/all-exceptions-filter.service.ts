import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { IBaseResponse } from '../app.interface';
import { AxiosError } from 'axios';

@Catch()
export class AllExceptionsFilterService implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    if (exception.isAxiosError) {
      this.logAxiosError(exception);
    } else {
      console.log(exception);
    }
    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    res.status(200).json({
      success: false,
      message: exception.message || 'Somethings went wrong !!',
      data: null,
    } as IBaseResponse<null>);
  }

  logAxiosError(error: AxiosError): void {
    console.log('AXIOS EXCEPTION');
    console.log('message:', error.message);
    console.log('config:', error.config);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const responseType = error.config.responseType;
      const response = error.response;
      console.log('responseType:', responseType);
      if (['json', 'document', 'text'].indexOf(responseType) !== -1) {
        console.log('response.data:', response.data);
      }
      console.log('response.headers:', response.headers);
      console.log('response.status:', response.status);
      console.log('response.statusText:', response.statusText);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('request:', error.request);
    }
  }
}
