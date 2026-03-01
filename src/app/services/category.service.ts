import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategoryRequest } from '../models/category.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  getAll(page = 1, size = 10, sort = 'name,asc'): Observable<PaginatedResponse<Category>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    return this.http.get<PaginatedResponse<Category>>(this.baseUrl, { params });
  }

  getActive(page = 1, size = 10, sort = 'name,asc'): Observable<PaginatedResponse<Category>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    return this.http.get<PaginatedResponse<Category>>(`${this.baseUrl}/active`, { params });
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  search(name: string, page = 1, size = 10): Observable<PaginatedResponse<Category>> {
    const params = new HttpParams().set('name', name).set('page', page).set('size', size);
    return this.http.get<PaginatedResponse<Category>>(`${this.baseUrl}/search`, { params });
  }

  create(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  update(id: string, category: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
