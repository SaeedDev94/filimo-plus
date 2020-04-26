import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
  ) {
  }

  scrollEvent: () => void;
  //
  @Input()
  container: HTMLElement;
  //
  @Input()
  callback: () => void;
  @Input()
  runAt = 70;
  @Input()
  disable = false;
  // tslint:disable-next-line:variable-name
  _loading = false;
  @Input()
  set loading(value: boolean) {
    this._loading = value;
    this.loadingChange.emit(value);
  }
  get loading(): boolean {
    return this._loading;
  }
  @Output()
  loadingChange = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.scrollEvent = () => {
      if (this.disable || this.loading) {
        return;
      }
      const scrollTop = this.container.scrollTop;
      const scrollHeight = this.container.scrollHeight;
      const clientHeight = this.container.clientHeight;
      const maxScrollPosition = scrollHeight - clientHeight;
      const progress = (scrollTop / maxScrollPosition) * 100;
      if (progress >= this.runAt) {
        this.loading = true;
        this.callback();
      }
    };
    this.container.addEventListener('scroll', this.scrollEvent);
  }

  ngOnDestroy(): void {
    this.container.removeEventListener('scroll', this.scrollEvent);
  }

}
