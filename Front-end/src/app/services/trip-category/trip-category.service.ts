import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { TripCategory } from 'src/app/models/TripCategory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripCategoryService {
  constructor(private httpClient: HttpClient) {}

  postTripCategory(TripCategory: TripCategory): Observable<TripCategory> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.post<TripCategory>(
      environment.api_url + '/TripCategories',
      TripCategory,
      {
        headers: headers,
      }
    );
  }
}
