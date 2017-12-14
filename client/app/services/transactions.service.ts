import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { API_ENDPOINT } from '../config';
import { AppState } from '../store/index';
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
    return this.http.get<T[]>(API_ENDPOINT + this.path, { params: params as { [param: string]: string } })
      .map(this._mapTransactions);
  }

  save(transaction: T): Observable<T> {
    if (transaction.id) {
      return this.http.put<T>(API_ENDPOINT + this.path + '/' + transaction.id, transaction).map(this._mapTransaction);
    }

    return this.http.post<T>(API_ENDPOINT + this.path, transaction).map(this._mapTransaction);
  }

  remove(transaction: T): Observable<any> {
    return this.http.delete(API_ENDPOINT + this.path + '/' + transaction.id);
  }

  restore(transaction: T): Observable<T> {
    return this.http.patch<T>(API_ENDPOINT + this.path + '/' + transaction.id + '/restore', null).map(this._mapTransaction);
  }

  protected _mapTransactions(transactions: T[]): T[] {
   return transactions.map(this._mapTransaction);
  }

  protected _mapTransaction(transaction: T): T {
    let users: User[];
    this.store.select(getCoupleMembers).take(1).subscribe((stateUsers: User[]) =>  { users = stateUsers; });

    transaction.payer = users.find((user: User) => (user.id === transaction.payerId));

    return transaction;
  }
}
