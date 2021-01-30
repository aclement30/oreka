import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'app/models/category.model';
import { Expense } from 'app/models/expense.model';
import { ExpensesService } from 'app/services/expenses.service';
import { ImportService, Operation } from 'app/services/import.service';
import { AppState } from 'app/store';
import { getCategories } from 'app/store/categories.reducer';
import { AddExpenses } from 'app/store/transactions.actions';
import { getCurrentUser } from 'app/store/user.reducer';
import { parse } from 'papaparse';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit, OnDestroy {
  categories: Category[];
  userId: number;
  formats = ImportService.FORMATS;
  file: File;
  fileFormat: string;
  operations: Operation[] = [];
  columnsToDisplay = ['select', 'opInfos', 'opDesc'];
  loading = false;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatTable) opTable: MatTable<Operation>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialogRef<ImportComponent>,
    private translate: TranslateService,
    private importService: ImportService,
    private expensesService: ExpensesService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.fileFormat = this.formats[0];
    this.store.select(getCategories).pipe(takeUntil(this.destroyed$)).subscribe(c => this.categories = c);
    this.store.select(getCurrentUser).pipe(takeUntil(this.destroyed$)).subscribe(u => this.userId = u.id);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
  }

  reset() {
    this.file = null;
    this.fileFormat = this.formats[0];
    this.operations = [];
  }

  onFileInput(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.loading = true;
    this.file = file;
    parse(file, { header: false, skipEmptyLines: true, complete: this.dataParsed });
  }

  dataParsed = (fileContent) => {
    const rows = fileContent.data;
    rows.shift();

    this.operations = this.importService.parseRawData(rows, this.fileFormat);
    this.loading = false;
  }

  allSelected(): boolean {
    return this.operations.length && this.operations.every(op => op.selected);
  }

  someSelected(): boolean {
    return !this.allSelected() && this.operations.some(op => op.selected);
  }

  masterToggle() {
    const selected = this.allSelected();
    this.operations.forEach(o => o.selected = !selected);
  }

  toggleOperation(op: Operation) {
    op.selected = !op.selected;
    op.description = op.bankDescription;
    op.comment = null;
    op.categoryId = null;
    this.opTable.renderRows();
  }

  submit() {
    this.loading = true;

    const ops: Expense[] = this.operations.filter(op => op.selected).map((op) => {
      return {
        id: null,
        date: op.date.format(),
        amount: op.amount,
        currency: 'CAD',
        payerShare: Math.round((op.amount / 2.0) * 100) / 100,
        payerId: this.userId,
        description: op.description,
        notes: op.comment,
        categoryId: op.categoryId,
      };
    });

    this.expensesService.import(ops).subscribe((data) => {
      this.store.dispatch(new AddExpenses(data));
      const notice = this.snackBar.open(this.translate.instant('import.success'), 'OK', { duration: 3000 });
      notice.onAction().subscribe(() => { notice.dismiss(); });
      this.loading = false;
      this.dialog.close();
    });
  }
}
