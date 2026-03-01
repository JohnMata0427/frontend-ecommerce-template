import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedResponse } from '../models/paginated-response.model';
import { Subcategory, SubcategoryRequest } from '../models/subcategory.model';

@Injectable({ providedIn: 'root' })
export class SubcategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/subcategories`;

  getAll(page = 1, size = 10, sort = 'name,asc'): Observable<PaginatedResponse<Subcategory>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    return this.http.get<PaginatedResponse<Subcategory>>(this.baseUrl, { params });
  }

  getActive(page = 1, size = 10, sort = 'name,asc'): Observable<PaginatedResponse<Subcategory>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);
    return this.http.get<PaginatedResponse<Subcategory>>(`${this.baseUrl}/active`, { params });
  }

  getById(id: string): Observable<Subcategory> {
    return this.http.get<Subcategory>(`${this.baseUrl}/${id}`);
  }

  getByCategory(
    categoryId: string,
    page = 1,
    size = 10,
  ): Observable<PaginatedResponse<Subcategory>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedResponse<Subcategory>>(`${this.baseUrl}/category/${categoryId}`, {
      params,
    });
  }

  search(name: string, page = 1, size = 10): Observable<PaginatedResponse<Subcategory>> {
    const params = new HttpParams().set('name', name).set('page', page).set('size', size);
    return this.http.get<PaginatedResponse<Subcategory>>(`${this.baseUrl}/search`, { params });
  }

  create(subcategory: SubcategoryRequest): Observable<Subcategory> {
    return this.http.post<Subcategory>(this.baseUrl, subcategory);
  }

  update(id: string, subcategory: SubcategoryRequest): Observable<Subcategory> {
    return this.http.put<Subcategory>(`${this.baseUrl}/${id}`, subcategory);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
