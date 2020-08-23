import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppData } from './app.data';
import { MDCSnackbar } from '@material/snackbar';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BodyScrollService } from './core/body-scroll.service';
import { FullscreenLoadingService } from './core/fullscreen-loading.service';
import { SnackbarService } from './core/snackbar.service';

export let fullscreenLoadingServiceObj: FullscreenLoadingService = null;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private appData: AppData,
    private bodyScrollService: BodyScrollService,
    private fullscreenLoadingService: FullscreenLoadingService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    fullscreenLoadingServiceObj = this.fullscreenLoadingService;
  }

  isFullscreenLoadingLayoutVisible = false;
  //
  snackbar: any = null;
  @ViewChild('snackbar', {static: false}) snackbarElementRef: ElementRef;

  ngOnInit(): void {
    this.router.onSameUrlNavigation = 'reload';
    this.handleRouterEvents();
    this.handleBodyScrollLock();
    this.handleFullscreenLoading();
    this.handleSnackbar();
  }

  ngAfterViewInit(): void {
    this.snackbar = new MDCSnackbar(this.snackbarElementRef.nativeElement);
  }

  ngOnDestroy(): void {
  }

  handleRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.fullscreenLoadingService.show();
      }
      if (event instanceof NavigationEnd) {
        this.fullscreenLoadingService.hide();
      }
      if (event instanceof NavigationError) {
        this.fullscreenLoadingService.hide();
      }
    });
  }

  handleBodyScrollLock(): void {
    this.bodyScrollService.subject$.subscribe(value => {
      if (value !== null) {
        const body = document.querySelector('.body') as HTMLElement;
        if (body) {
          body.style.overflowX = value ? 'hidden' : 'auto';
          body.style.overflowY = value ? 'hidden' : 'scroll';
        }
      }
    });
  }

  handleFullscreenLoading() {
    this.fullscreenLoadingService.subject$.subscribe(value => {
      if (value !== null) {
        this.isFullscreenLoadingLayoutVisible = value;
        if (value) {
          this.bodyScrollService.lock();
          return;
        }
        this.bodyScrollService.unlock();
      }
    });
  }

  handleSnackbar(): void {
    this.snackbarService.subject$.subscribe(value => {
      if (value) {
        if (this.snackbar?.isOpen) {
          this.snackbar?.close('new text');
        }
        this.snackbar.labelText = value;
        this.snackbar?.open();
      }
    });
  }
}
