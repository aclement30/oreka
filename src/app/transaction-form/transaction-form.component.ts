import { Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseTransaction } from 'app/models/transaction.model';
import { User } from 'app/models/user.model';
import { TransactionsService } from 'app/services/transactions.service';
import { AppState } from 'app/store';
import { getCoupleMembers, getPartner } from 'app/store/couple.reducer';
import { getCurrentUser } from 'app/store/user.reducer';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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

    this.user$.pipe(take(1)).subscribe((user: User) => { this.userId = user.id; });

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
