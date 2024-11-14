import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AveragePerMinComponent } from './average-per-min/average-per-min.component';
import { LastHourAvgComponent } from './last-hour-avg/last-hour-avg.component';
import { MaxValueComponent } from './max-value/max-value.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AveragePerMinComponent, LastHourAvgComponent, MaxValueComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
