import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-last-hour-avg',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './last-hour-avg.component.html',
  styleUrl: './last-hour-avg.component.scss'
})
export class LastHourAvgComponent {

}
