import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from 'src/app/services/weather/weather.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faCloudShowersHeavy, faCloud, faCloudRain, faSmog, faSnowflake, faWind, faCloudBolt, faDroplet, faTemperatureArrowUp, faTemperatureArrowDown, faTemperatureHalf, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { WeathercardComponent } from "../weathercard/weathercard.component";

@Component({
    selector: 'app-forecastcard',
    standalone: true,
    templateUrl: './forecastcard.component.html',
    styleUrls: ['./forecastcard.component.css'],
    imports: [CommonModule, MatTooltipModule, FontAwesomeModule, WeathercardComponent]
})

export class ForecastcardComponent implements OnChanges{
  faSun = faSun;
  faCloud = faCloud;
  faCloudRain = faCloudRain;
  faCloudBolt = faCloudBolt;
  faCloudShowersHeavy = faCloudShowersHeavy;
  faSmog = faSmog;
  faSnowflake = faSnowflake;
  faWind = faWind;
  faDroplet = faDroplet;
  faTemperatureArrowUp = faTemperatureArrowUp;
  faTemperatureArrowDown = faTemperatureArrowDown;
  faTemperature = faTemperatureHalf;
  faLocationArrow = faLocationArrow;

  @Input() city: string = '';
  forecastList: any[] = [];

  constructor(private weatherService: WeatherService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city']) {
      this.getWeatherDataCarousel(this.city);
    }
  }

  ngOnInit() {
    if (this.city) {
      this.getWeatherDataCarousel(this.city);
    }
  }

  getWeatherDataCarousel(city: string) {
   
    // Exclude the first record for current weather data (WeathercardComponent)
    // Disable for demo

    if (city!= ''){
      this.weatherService.getWeatherForecast(city).subscribe(forecastData => {
        const forecastsToMap = forecastData.slice(1);
        this.forecastList = this.mapWeatherData(forecastsToMap);
      });
    } 
     
  }

  private mapWeatherData(forecastData: any[]): any[] {
    // Map icons and day of the week for each forecast in the list
    return forecastData.map(forecast => {
      const weatherCode = forecast.weatherCode.toString();
      const dayOfWeek = this.getDayOfWeek(forecast.date);
      const icon = this.mapIconForForecast(weatherCode);

      return { ...forecast, icon, dayOfWeek };
    });
  }

  private mapIconForForecast(weatherCode: string): any {
    // Map icons based on weather code
    switch (weatherCode.charAt(0)) {
      case '2':
        return this.faCloudBolt;
      case '3':
        return this.faCloudShowersHeavy;
      case '5':
        return this.faCloudRain;
      case '6':
        return this.faSnowflake;
      case '7':
        return this.faSmog;
      case '8':
        return weatherCode === '800' ? this.faSun : this.faCloud;
      default:
        return null;
    }
  }

  private getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  }

  formatDate(dateString: string): string {
    // Split the date into year, month, and day
    // Year is unused but needs to stay for split
    const [year, month, day] = dateString.split('-');
    
    // Create the formatted date in the desired order
    const formattedDate = `${day}/${month}`;

    return formattedDate;
  }
}
