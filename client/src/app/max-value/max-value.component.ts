import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-max-value',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './max-value.component.html',
  styleUrl: './max-value.component.scss'
})
export class MaxValueComponent {

}
