import { Injectable } from '@angular/core';
import { format, fromUnixTime } from 'date-fns';

@Injectable()
export class DateService {
  formatTimestamp(timestamp: string | number | Date): string {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
  }
}