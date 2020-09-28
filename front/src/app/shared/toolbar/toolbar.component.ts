import { MDCMenu } from '@material/menu';
import { MDCDialog } from '@material/dialog';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppData } from '../../app.data';
import { IUser } from '../../app.interface';
import { AuthService } from '../../core/auth.service';
import { StateService } from '../../core/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private appData: AppData,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private stateService: StateService,
    private router: Router
  ) {
  }

  body: HTMLElement;
  user: IUser;
  //
  menu: any;
  @ViewChild('menuElement', {static: false})
  set menuElement(value: ElementRef) {
    this.menu = new MDCMenu(value.nativeElement);
    this.menu.setAbsolutePosition(0, 66);
    this.changeDetectorRef.detectChanges();
  }
  //
  dialog: any;
  @ViewChild('dialogElement', {static: false})
  set dialogElement(value: ElementRef) {
    this.dialog = new MDCDialog(value.nativeElement);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.user = this.appData.data.user;
  }

  ngAfterViewInit(): void {
    this.body = document.querySelector('.body');
    this.body.style.height = 'calc(100% - 69px)';
  }

  ngOnDestroy(): void {
    this.body.style.height = '100%';
  }

  toggleMenu(): void {
    this.menu.open = !this.menu.open;
  }

  openDialog() {
    this.dialog.open();
  }

  closeDialog() {
    this.dialog.close();
  }

  navigateHome() {
    this.appData.invalidateCache();
    this.router.navigate(['home']);
  }

  logout() {
    this.closeDialog();
    this.authService.logout().subscribe({
      complete: () => {
        localStorage.removeItem('jwt_token');
        this.appData.invalidateCache();
        this.stateService.loggedIn = false;
        this.router.navigate(['login']);
      }
    });
  }

}
