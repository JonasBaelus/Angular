import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class WeatherService {
  private apiKeyOWM = '2a444fca590795d3b6b2810d869290f5';
  private apiKeyWB = '91c466ed926949e3bfd07c64fb87da25';

  constructor(private http: HttpClient) {}

  // OpenWeatherMap for Current Weather

  getWeather(city: string): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKeyOWM}`;

    return this.http.get(url).pipe(
      map((response: any) => this.mapWeatherResponse(response))
    );
  }

  // Weatherbit for forecasts 

  getWeatherForecast(city: string): Observable<any> {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${this.apiKeyWB}`;

    return this.http.get(url).pipe(
      map((response: any) => this.mapForecastResponse(response))
    );
  }

  private truncData(temperature: number): string {
    const roundedData = Math.trunc(temperature);
    return `${roundedData}`;
  }

  private mapWeatherResponse(response: any): any {
    if (response && response.main && response.weather) {
      return {
        temp: this.truncData(response.main.temp),
        mintemp: this.truncData(response.main.temp_min),
        maxtemp: this.truncData(response.main.temp_max),
        humidity: response.main.humidity,
        weatherCode: response.weather[0].id,
        description: response.weather[0].description,
        windspeed: this.truncData(response.wind.speed),
        winddegree: response.wind.deg,
        name: response.name,
        country: response.sys.country,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset,
        date: response.dt,
        timezone: response.timezone
      };
    }
    return null;
  }

  private mapForecastResponse(response: any): any[] {
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
  
    const forecastList: any[] = [];
  
    response.data.forEach((item: any) => {
      forecastList.push({
        temp: this.truncData(item.temp),
        mintemp: this.truncData(item.min_temp),
        maxtemp: this.truncData(item.max_temp),
        humidity: item.rh,
        weatherCode: item.weather.code,
        description: item.weather.description,
        windspeed: item.wind_spd,
        winddegree: item.wind_dir,
        name: response.city_name,
        country: response.country_code,
        date: item.valid_date
      });
    });
  
    return forecastList;
  }
  

  // 3-hour forecast => Daily mapper for OpenWeatherMap API

  /*
  mapForecastResponse(response: any): any[] {
    if (!response || !response.list) {
      return [];
    }
  
    const forecastList: any[] = [];
  
    // Group forecast items by date using dt_txt
    const groupedByDate: { [key: string]: any[] } = {};
  
    response.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0]; // Extract date part from dt_txt
  
      // Use a Map to store items for each date
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
    });
  
    // Extract min and max temperature for each date
    for (const date in groupedByDate) {
      const items = groupedByDate[date];
  
      // Use reduce to find min and max temperature
      const { minTemp, maxTemp } = items.reduce(
        (acc, item) => {
          return {
            minTemp: Math.min(acc.minTemp, item.main.temp_min),
            maxTemp: Math.max(acc.maxTemp, item.main.temp_max),
          };
        },
        { minTemp: Infinity, maxTemp: -Infinity }
      );
  
      // Assuming the date is the same for all items on the given date
      const firstItem = items[0];
  
      forecastList.push({
        datetime: new Date(firstItem.dt * 1000),
        mintemp: this.formatTemperature(minTemp),
        maxtemp: this.formatTemperature(maxTemp),
        humidity: firstItem.main.humidity,
        weather: firstItem.weather[0].main,
        description: firstItem.weather[0].description,
        windspeed: firstItem.wind.speed,
        winddeg: firstItem.wind.deg,
        name: response.city.name,
        country: response.city.country,
      });
    }
  
    return forecastList;
  }
  */

}