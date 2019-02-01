import { Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { AppState } from '../store/index';
import { User } from '../models/user.model';

import { getCurrentUser } from '../store/user.reducer';
import { getCoupleMembers, getPartner } from '../store/couple.reducer';
import { TransactionsService } from '../services/transactions.service';
import { BaseTransaction } from '../models/transaction.model';

@Injectable()
export abstract class TransactionFormComponent implements OnInit {
  form: FormGroup;
  user$: Observable<User>;
  partner$: Observable<User>;
  coupleMembers$: Observable<User[]>;

  protected abstract transactionsService: TransactionsService<any>;
  protected userId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    protected dialog: MatDialogRef<TransactionFormComponent>,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    protected store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.user$ = this.store.select(getCurrentUser);
    this.partner$ = this.store.select(getPartner);
    this.coupleMembers$ = this.store.select(getCoupleMembers);

    this.user$.take(1).subscribe((user: User) => { this.userId = user.id; });

    this.form = this.buildForm(this.data && this.data.transaction);
  }

  abstract buildForm(transaction?: BaseTransaction): FormGroup;

  submit(): void {
    if (this.form.valid) {
      this.transactionsService.save(this.form.value)
        .subscribe(this.afterSave);
    }
  }

  abstract afterSave = (transaction: BaseTransaction): void => {};
}
