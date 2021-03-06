import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Category } from 'app/models/category.model';
import { AppState } from 'app/store';
import { SetCategories } from 'app/store/categories.actions';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoriesService {

  protected path = '/categories';

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
  ) {}

  query(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiEndpoint + this.path)
      .pipe(
        map((categories: Category[]) => {
          this.store.dispatch(new SetCategories(categories));
          return categories;
        }),
      );
  }
}
