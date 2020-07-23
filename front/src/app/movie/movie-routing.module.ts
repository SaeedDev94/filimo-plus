import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieComponent } from './movie.component';
import { MovieResolver } from './movie.resolver';

const routes: Routes = [
  {
    path: '',
    component: MovieComponent,
    resolve: {
      movie: MovieResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovieRoutingModule {}
