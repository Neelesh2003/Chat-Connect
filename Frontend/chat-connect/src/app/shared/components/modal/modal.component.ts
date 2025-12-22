import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalData } from '../../models/shared.models';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() data!: ModalData;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>();

  onConfirm(): void {
    this.closeModal.emit(true);
  }

  onCancel(): void {
    this.closeModal.emit(false);
  }
}