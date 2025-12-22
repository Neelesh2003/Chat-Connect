import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiService } from './services/api.service';
import { LoaderService } from './services/loader.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { TimestampPipe } from './pipes/timestamp.pipe';

@NgModule({
  declarations: [TimestampPipe],
  imports: [CommonModule],
  providers: [
    ApiService,
    LoaderService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  exports: [TimestampPipe]
})
export class CoreModule { }