import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AppState } from '../store';
import { BaseTransaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import { getCoupleMembers } from '../store/couple.reducer';

interface QueryParams {
  readonly limit?: number | string;
  readonly page?: number | string;
}

@Injectable()
export abstract class TransactionsService<T extends BaseTransaction> {

  protected abstract path: string;

  constructor(
    protected http: HttpClient,
    protected store: Store<AppState>,
  ) {
    this._mapTransactions = this._mapTransactions.bind(this);
    this._mapTransaction = this._mapTransaction.bind(this);
  }

  query(params?: QueryParams): Observable<T[]> {
    return this.http
      .get<T[]>(environment.API_ENDPOINT + this.path, { params: params as { [param: string]: string } })
      .pipe(map(this._mapTransactions));
  }

  save(transaction: T): Observable<T> {
    if (transaction.id) {
      return this.http
        .put<T>(environment.API_ENDPOINT + this.path + '/' + transaction.id, transaction)
        .pipe(map(this._mapTransaction));
    }

    return this.http
      .post<T>(environment.API_ENDPOINT + this.path, transaction)
      .pipe(map(this._mapTransaction));
  }

  remove(transaction: T): Observable<any> {
    return this.http.delete(environment.API_ENDPOINT + this.path + '/' + transaction.id);
  }

  restore(transaction: T): Observable<T> {
    return this.http
      .patch<T>(environment.API_ENDPOINT + this.path + '/' + transaction.id + '/restore', null)
      .pipe(map(this._mapTransaction));
  }

  protected _mapTransactions(transactions: T[]): T[] {
   return transactions.map(this._mapTransaction);
  }

  protected _mapTransaction(transaction: T): T {
    let users: User[];
    this.store
      .select(getCoupleMembers)
      .pipe(take(1))
      .subscribe((stateUsers: User[]) =>  { users = stateUsers; });

    transaction.payer = users.find((user: User) => (user.id === transaction.payerId));

    return transaction;
  }
}
