// city.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apikey = '15b9ec0018e94c5d94a045b11d020d6c';

  constructor(private http: HttpClient) {}

  // for autocomplete locations
  getCities(city: string): Observable<any> {
    
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${city}&apiKey=${this.apikey}`;

    return this.http.get(url).pipe(
      map((response: any) => {
        if (response && response.features) {
          return response.features.map((feature: any) => ({
            name: feature.properties.city,
            country: feature.properties.country,
            adminName: feature.properties.state
          }));
        }
        return [];
      })
    );
  }
}
