import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDownloadRequest, IMovie } from '../app.interface';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SnackbarService } from '../core/snackbar.service';
import { MovieService } from './movie.service';
import { Log } from '../shared/helper/log.helper';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private movieService: MovieService,
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  movie: IMovie;
  downloadForm = this.formBuilder.group({
    quality: [-1, [Validators.min(0)]]
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.movie = data.movie;
      }
    });
  }

  startDownload(): void {
    const quality = this.downloadForm.controls.quality as FormControl;
    if (quality.invalid) {
      this.snackbarService.showMessage('کیفیت انتخاب نشده');
      return;
    }
    const variant = this.movie.download.variants[quality.value];
    const download: IDownloadRequest = {
      link: variant.link,
      id: this.movie.id,
      title: this.movie.title,
      quality: variant.quality,
      resolution: variant.resolution,
      subtitle: this.movie.download.subtitle,
      image: this.movie.image,
    };
    const dlRequest = this.movieService.requestDownload(download).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['download']);
          return;
        }
        this.snackbarService.showMessage(response.message);
      },
      error: (error) => {
        Log.e('MovieService#requestDownload', error);
      },
      complete: () => {
        dlRequest.unsubscribe();
      }
    });
  }

}
