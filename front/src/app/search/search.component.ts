import { Component, OnInit } from '@angular/core';
import { ISearch } from '../app.interface';
import { FormBuilder } from '@angular/forms';
import { SearchService } from './search.service';
import { Log } from '../shared/helper/log.helper';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService
  ) {
  }

  searchForm = this.formBuilder.group({
    keyword: ['']
  });
  items: ISearch[] = [];

  ngOnInit(): void {
    this.searchForm.controls.keyword.valueChanges.subscribe({
      next: (data) => {
        const keyword = data.trim();
        if (keyword.length < 2) {
          return;
        }
        this.searchService.query(keyword).subscribe({
          next: (response) => {
            Log.i('SearchService#query', response);
            if (response.success) {
              this.items = response.data;
            }
          },
          error: (error) => {
            Log.e('SearchService#query', error);
          }
        });
      }
    });
  }

}
