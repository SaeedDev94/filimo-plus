import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '../../app.interface';

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
  item: IItem;
  @Input()
  includeTagLink = true;

  ngOnInit(): void {
  }

  toggleSpecialItemsShowMore(): void {
    this.specialItemsShowMore = !this.specialItemsShowMore;
  }

}
