import { NgModule } from '@angular/core';
import { MovieRoutingModule } from './movie-routing.module';
import { MovieComponent } from './movie.component';
import { SharedModule } from '../shared/shared.module';
import { MovieService } from './movie.service';
import { MovieResolver } from './movie.resolver';

@NgModule({
  declarations: [MovieComponent],
  imports: [
    SharedModule,
    MovieRoutingModule
  ],
  providers: [
    MovieService,
    MovieResolver
  ]
})
export class MovieModule {}
