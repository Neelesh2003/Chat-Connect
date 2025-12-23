import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
  // Removed standalone/imports - NgModule handles
})
export class CreateGroupDialogComponent {
  groupName = '';
  selectedMembers: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users: any[] }
  ) {
    // Initialize selected for checkboxes
    this.data.users.forEach(user => user.selected = false);
  }

  onSubmit(): void {
    if (!this.groupName.trim() || this.selectedMembers.length === 0) {
      alert('Please enter group name and select members');
      return;
    }
    this.dialogRef.close({ name: this.groupName.trim(), members: this.selectedMembers });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  toggleMember(userId: number): void {
    if (this.selectedMembers.includes(userId)) {
      this.selectedMembers = this.selectedMembers.filter(id => id !== userId);
    } else {
      this.selectedMembers.push(userId);
    }
  }
}