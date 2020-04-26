import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FullscreenLoadingService {

  constructor(
  ) {
  }

  private subject = new BehaviorSubject<boolean>(null);
  subject$ = this.subject.asObservable();

  show(): void {
    this.subject.next(true);
  }

  hide(): void {
    this.subject.next(false);
  }
}
