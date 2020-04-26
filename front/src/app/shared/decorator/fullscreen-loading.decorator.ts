import { fullscreenLoadingServiceObj } from '../../app.component';

export function FullscreenLoading(): MethodDecorator {
  return ((target: any, key: string, descriptor: any): any => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      fullscreenLoadingServiceObj.show();
      return originalMethod.apply(this, args);
    };
    return descriptor;
  }) as MethodDecorator;
}
