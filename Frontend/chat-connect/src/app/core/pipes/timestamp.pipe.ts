import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../services/date.service';

@Pipe({ name: 'timestamp' })
export class TimestampPipe implements PipeTransform {
  constructor(private dateService: DateService) {}

  transform(value: string | number | Date): string {
    return this.dateService.formatTimestamp(value);
  }
}