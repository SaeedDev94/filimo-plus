import { HttpModule, Module } from '@nestjs/common';
import { HttpConfigService } from './http-config.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilterService } from './all-exceptions-filter.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService
    })
  ],
  exports: [
    HttpModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilterService
    }
  ]
})
export class SharedModule {}
