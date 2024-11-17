import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-average-per-min',
  standalone: true,
  imports: [CardComponent, HttpClientModule],
  templateUrl: './average-per-min.component.html',
  styleUrl: './average-per-min.component.scss',
})
export class AveragePerMinComponent {
  data1: any;
  data2: any;
  data3: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.callMultipleApis();
    setInterval(() => {
      this.callMultipleApis();
    }, 15000);
  }

  callMultipleApis() {
    const apiUrl1 = 'http://localhost:3000/api/temp';
    const apiUrl2 = 'http://localhost:3000/api/avg';
    const apiUrl3 = 'http://localhost:3000/api/max';

    forkJoin({
      api1: this.http.get(apiUrl1),
      api2: this.http.get(apiUrl2),
      api3: this.http.get(apiUrl3),
    }).subscribe({
      next: (responses) => {
        console.log('Response from API 1:', responses.api1);
        this.data1 = responses.api1;
        console.log('Response from API 2:', responses.api2);
        this.data2 = responses.api2;
        console.log('Response from API 3:', responses.api3);
        this.data3 = responses.api3;
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }
}
