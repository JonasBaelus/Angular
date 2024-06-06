import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ActivityType } from 'src/app/models/ActivityType';
import { PaginatedResult } from 'src/app/models/Pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityTypeService {
  constructor(private httpClient: HttpClient) {}

  getPaginatedActivityTypes(
    searchQuery?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<PaginatedResult<ActivityType[]>> {
    const paginatedResults: PaginatedResult<ActivityType[]> =
      new PaginatedResult<ActivityType[]>();

    let params = new HttpParams();

    if (searchQuery != null && searchQuery.trim() != '') {
      params = params.append('searchQuery', searchQuery);
    }

    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return this.httpClient
      .get<ActivityType[]>(environment.api_url + '/activities/paginated-activities', {
        responseType: 'json',
        observe: 'response',
        params,
      })
      .pipe(
        map((res) => {
          paginatedResults.result = res.body!;
          if (res.headers.get('Pagination') != null) {
            paginatedResults.pagination = JSON.parse(
              res.headers.get('Pagination')!
            );
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

  getActivityTypes() {
    return this.httpClient
      .get<ActivityType[]>(environment.api_url + '/activities')
  }

  deleteActivityType(id: number): Observable<ActivityType> {
    return this.httpClient.delete<ActivityType>(
      environment.api_url + '/activities/' + id
    );
  }

  getActivityTypeById(id: number): Observable<ActivityType> {
    return this.httpClient.get<ActivityType>(
      environment.api_url + '/activities/' + id
    );
  }

  postActivityType(activity: ActivityType): Observable<ActivityType> {
    return this.httpClient.post<ActivityType>(
      environment.api_url + '/activities/',
      activity
    );
  }

  putActivityType(id: number, activity: ActivityType): Observable<void> {
    return this.httpClient.put<void>(
      environment.api_url + '/activities/' + id,
      activity
    );
  }
}
