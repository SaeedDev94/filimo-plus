import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagComponent } from './tag.component';
import { TagResolver } from './tag.resolver';

const routes: Routes = [
  {
    path: '',
    component: TagComponent,
    resolve: {
      tag: TagResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule {}
