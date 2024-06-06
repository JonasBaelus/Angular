import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Activity } from 'src/app/models/Activity';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private httpClient: HttpClient) {}

  getActivities(): Observable<Activity[]> {
    return this.httpClient.get<Activity[]>(
      environment.api_url + '/tripactivities/'
    );
  }

  deleteActivity(id: number): Observable<Activity> {
    return this.httpClient.delete<Activity>(
      environment.api_url + '/tripactivities/' + id
    );
  }

  getActivityById(id: number): Observable<Activity> {
    return this.httpClient.get<Activity>(
      environment.api_url + '/tripactivities/' + id
    );
  }

  postActivity(activity: Activity): Observable<Activity> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.post<Activity>(
      environment.api_url + '/tripactivities',
      activity,
      { headers: headers }
    );
  }

  putActivity(id: number, activity: Activity): Observable<void> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.httpClient.put<void>(
      environment.api_url + '/tripactivities/' + id,
      activity,
      { headers: headers }
    );
  }
}
