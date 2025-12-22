import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'timestamp',
  standalone:false
})
export class TimestampPipe implements PipeTransform {
  transform(value: string | Date): string {
    return format(new Date(value), 'hh:mm a');
  }
}