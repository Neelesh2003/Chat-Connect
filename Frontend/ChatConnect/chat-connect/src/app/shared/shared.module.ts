import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for any shared forms if needed
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from '../common/loader/loader.component';

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, FormsModule],
  exports: [LoaderComponent],
  providers: [LoaderService]
})
export class SharedModule { }