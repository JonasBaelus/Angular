import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, catchError, throwError } from 'rxjs';
import { PaginatedResult } from 'src/app/models/Pagination';
import { Trip } from 'src/app/models/Trip';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private httpClient: HttpClient) {}

  private tripIdSubject = new BehaviorSubject<number>(0);
  tripId$ = this.tripIdSubject.asObservable();

  setTripId(id: number) {
    this.tripIdSubject.next(id);
  }

  getTrips(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(environment.api_url + '/Trips');
  }

  getTripById(id: number): Observable<Trip> {
    return this.httpClient.get<Trip>(environment.api_url + '/Trips/' + id);
  }

  getPublicTrips(searchQuery?: string, categories?: number[], pageNumber?: number, pageSize?: number): Observable<PaginatedResult<Trip[]>> {

    const paginatedResults: PaginatedResult<Trip[]> = new PaginatedResult<Trip[]>();

    let params = new HttpParams();

    if (searchQuery != null && searchQuery.trim() != '') {
      params = params.append('searchQuery', searchQuery);
    }

    if (categories?.length != 0) {
      const categoriesHeader = categories!.join(',');
      params = params.append('categories', categoriesHeader);
    }

    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return this.httpClient.get<Trip[]>(
      environment.api_url + '/Trips/public-trips', {responseType: 'json', observe: 'response', params}
      ).pipe(
        map(res => {
          paginatedResults.result = res.body!;
          if (res.headers.get('Pagination') != null) {
            paginatedResults.pagination = JSON.parse(res.headers.get('Pagination')!)
          }
          return paginatedResults;
        }),
        catchError((error) => {
          // Handle error logic here
          console.error('Error occurred:', error);
          return throwError(error); // Re-throwing the error to propagate it further
        })
      );
  }

  updateTrip(tripId: number, updatedData: Trip): Observable<any> {
    const url = environment.api_url + '/Trips/' + tripId;

    return this.httpClient.put(url, updatedData);
  }

  postTrip(trip: Trip): Observable<Trip> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.post<Trip>(environment.api_url + '/Trips', trip, {
      headers: headers,
    });
  }

  deleteTrip(tripId: number): Observable<Trip> {
    return this.httpClient.delete<Trip>(
      environment.api_url + '/Trips/' + tripId
    );
  }
}
