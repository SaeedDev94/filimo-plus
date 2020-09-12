import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginGuard } from './core/guard/login.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
      {path: 'tag/:id', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule)},
      {path: 'movie/:id', loadChildren: () => import('./movie/movie.module').then(m => m.MovieModule)},
      {path: 'download', loadChildren: () => import('./download/download.module').then(m => m.DownloadModule)},
      {path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)},
      {path: 'play/:id/:type', loadChildren: () => import('./play/play.module').then(m => m.PlayModule)},
    ]
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
