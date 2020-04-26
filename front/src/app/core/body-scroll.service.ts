import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BodyScrollService {

  constructor(
  ) {
  }

  private subject = new BehaviorSubject<boolean>(null);
  subject$ = this.subject.asObservable();

  lock(): void {
    this.subject.next(true);
  }

  unlock(): void {
    this.subject.next(false);
  }
}
