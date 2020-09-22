import { Component, Input, OnInit } from '@angular/core';
import { IList } from '../../app.interface';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  constructor(
  ) {
  }

  specialItemsShowMore = false;
  @Input()
  homeSpecial = false;
  @Input()
  list: IList;
  @Input()
  includeTagLink = true;

  ngOnInit(): void {
  }

  toggleSpecialItemsShowMore(): void {
    this.specialItemsShowMore = !this.specialItemsShowMore;
  }

}
