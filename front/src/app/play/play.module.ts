import { NgModule } from '@angular/core';
import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './play.component';
import { SharedModule } from "../shared/shared.module";
import { PlayResolver } from "./play.resolver";
import { PlayService } from "./play.service";

@NgModule({
  declarations: [
    PlayComponent
  ],
  imports: [
    SharedModule,
    PlayRoutingModule
  ],
  providers: [
    PlayService,
    PlayResolver
  ]
})
export class PlayModule {}
