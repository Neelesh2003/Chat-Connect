import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { ApiService } from './services/api.service';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { DateService } from './services/date.service';
import { ErrorService } from './services/error.service';

@NgModule({
  declarations: [TimestampPipe],
  imports: [CommonModule],
  providers: [
    ApiService,
    DateService,
    ErrorService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [TimestampPipe]
})
export class CoreModule { }