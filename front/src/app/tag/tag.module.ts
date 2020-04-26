import { NgModule } from '@angular/core';
import { TagRoutingModule } from './tag-routing.module';
import { TagComponent } from './tag.component';
import { SharedModule } from '../shared/shared.module';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';

@NgModule({
  declarations: [TagComponent],
  imports: [
    SharedModule,
    TagRoutingModule
  ],
  providers: [
    TagService,
    TagResolver
  ]
})
export class TagModule {}
