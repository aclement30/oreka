import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';
import { SetCategories } from '../store/categories.actions';
import { AppState } from '../store';

@Injectable()
export class CategoriesService {

  protected path = '/categories';

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
  ) {}

  query(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.API_ENDPOINT + this.path).pipe(
      map((categories: Category[]) => {
        this.store.dispatch(new SetCategories(categories));
        return categories;
      }),
    );
  }
}