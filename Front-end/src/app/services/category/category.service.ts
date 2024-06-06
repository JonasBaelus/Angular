import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from 'src/app/models/Pagination';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  getPaginatedCategories(
    searchQuery?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<PaginatedResult<Category[]>> {

    const paginatedResults: PaginatedResult<Category[]> =
      new PaginatedResult<Category[]>();

    let params = new HttpParams();

    if (searchQuery != null && searchQuery.trim() != '') {
      params = params.append('searchQuery', searchQuery);
    }

    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return this.httpClient.get<Category[]>(environment.api_url + '/Categories/paginated-categories', {
      responseType: 'json',
      observe: 'response',
      params,
    }
    ).pipe(
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

  getCategories(){
    return this.httpClient.get<Category[]>(environment.api_url + '/Categories');
  }

  deleteCategory(id: number): Observable<Category> {
    return this.httpClient.delete<Category>(
      environment.api_url + '/Categories/' + id
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(
      environment.api_url + '/Categories/' + id
    );
  }

  postCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(
      environment.api_url + '/Categories/create',
      category
    );
  }

  putCategory(id: number, category: Category): Observable<void> {
    return this.httpClient.put<void>(
      environment.api_url + '/Categories/' + id,
      category
    );
  }
}
