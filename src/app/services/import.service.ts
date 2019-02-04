import { Injectable } from '@angular/core';
import { capitalize, sortBy, trim } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface Operation {
  date: Moment;
  amount: number;
  bankDescription: string;
  helpText: string;
  description: string;
  payerShare: number;
  categoryId: number;
  selected: boolean;
  comment: string;
}

interface FormatMapping {
  [key: string]: FieldMapping;
}

interface FieldMapping {
  date: number;
  dateFormat: string;
  amount: number;
  description: number;
  helpText: number;
  accountNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  static FORMATS: string[] = ['RBC', 'TNG', 'DSJ'];

  static FIELDS_MAPPING: FormatMapping = {
    RBC: {
      date: 2,
      dateFormat: 'MM/DD/YYYY',
      amount: 6,
      description: 4,
      helpText: 5,
      accountNumber: 1,
    },
  };

  constructor() { }

  parseRawData(rows: (string[])[], format: string): Operation[] {
    const mapping = ImportService.FIELDS_MAPPING[format];

    if (!mapping) {
      return [];
    }

    return sortBy(rows.map((op: string[]): Operation => {
      const amount = parseFloat(op[mapping.amount]);

      if (amount > 0) {
        return;
      }

      return {
        date: moment(op[mapping.date], mapping.dateFormat),
        amount: Math.abs(amount),
        payerShare: 50,
        categoryId: null,
        selected: false,
        comment: null,
        ...this.parseDescription(op, mapping),
      };
    }).filter(Boolean), 'date');
  }

  parseDescription(op, mapping: FieldMapping): { bankDescription: string; description: string; helpText: string } {
    const creditCard: RegExp = /^\d{16}$/gi;

    if (creditCard.test(op[mapping.accountNumber])) {
      return {
        bankDescription: this.handleString(op[mapping.description]),
        description: this.handleString(op[mapping.description]),
        helpText: this.handleString(op[mapping.helpText]),
      };
    } else {
      return {
        bankDescription: this.handleString(op[mapping.helpText]),
        description: this.handleString(op[mapping.helpText]),
        helpText: this.handleString(op[mapping.description]),
      };
    }
  }

  handleString(str: string): string {
    return trim(str).split(' ').map(s => capitalize(s.toLowerCase())).join(' ');
  }
}
