import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { default as VideoPlayer, VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import { ActivatedRoute } from '@angular/router';
import { IPlay } from '../app.interface';
import { environment } from '../../environments/environment';
import { FullscreenLoadingService } from '../core/fullscreen-loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private fullscreenLoadingService: FullscreenLoadingService
  ) {
  }

  @ViewChild('player', {static: true})
  element: ElementRef;
  player: VideoJsPlayer;
  keyUpCallback: any;
  baseUrl = environment.baseUrl;
  fullscreenLoadingSubscription: Subscription;

  ngOnInit(): void {
    const play: IPlay = this.activatedRoute.snapshot.data.play;
    const options: VideoJsPlayerOptions = {
      controls: true,
      autoplay: true,
      sources: [
        {
          src: play.src,
          type: play.type
        }
      ]
    };
    if (play.subtitle) {
      options.tracks = [
        {
          src: play.subtitle,
          label: 'Subtitle',
          kind: 'captions',
          default: false
        }
      ];
    }
    this.player = VideoPlayer(this.element.nativeElement, options);
    this.keyUpCallback = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        this.player?.paused() ? this.player?.play() : this.player?.pause();
      }
    };
    document.addEventListener('keyup', this.keyUpCallback);
    this.fullscreenLoadingSubscription = this.fullscreenLoadingService.subject$.subscribe({
      next: (value) => {
        if (value) {
          this.player?.pause();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('.vjs-button').forEach((btn: HTMLButtonElement) => {
      btn.addEventListener('focus', () => {
        btn.blur();
      });
    });
  }

  ngOnDestroy(): void {
    this.player?.dispose();
    document.removeEventListener('keyup', this.keyUpCallback);
    this.fullscreenLoadingSubscription?.unsubscribe();
  }

}
