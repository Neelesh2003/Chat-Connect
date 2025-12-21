import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; // Assume added to package.json

@Injectable()
export class ErrorService {
  constructor(private toastr: ToastrService) {}

  handleError(error: any) {
    this.toastr.error(error.message || 'An error occurred');
  }
}