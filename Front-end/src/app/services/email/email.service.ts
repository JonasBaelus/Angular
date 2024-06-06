import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { Observable, catchError, map, of } from 'rxjs';
import { UserTrip } from 'src/app/models/UserTrip';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private httpClient: HttpClient) {}

  sendEmail(
    email: string,
    userId: string,
    tripId: number
  ): Observable<boolean> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    const requestData = {
      email: email,
      userId: userId,
      tripId: tripId,
    };

    return this.httpClient
      .post<string>(`${environment.api_url}/Email`, requestData, {
        headers: headers,
      })
      .pipe(
        map(() => {
          return true;
        }),
        catchError((error) => {
          console.error('Error sending email:', error);
          return of(false);
        })
      );
  }
}
