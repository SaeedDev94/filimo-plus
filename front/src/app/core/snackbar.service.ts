import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SnackbarService {

  constructor(
  ) {
  }

  private subject = new BehaviorSubject<string>(null);
  subject$ = this.subject.asObservable();

  showMessage(value: string): void {
    this.subject.next(value);
  }
}
