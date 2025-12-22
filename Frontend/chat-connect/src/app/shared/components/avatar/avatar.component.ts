import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: false,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() username: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() isOnline: boolean = false;
  @Input() imageUrl?: string;

  get initials(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }

  get sizeClass(): string {
    return this.size === 'small' ? 'avatar-small' : this.size === 'large' ? 'avatar-large' : 'avatar-medium';
  }
}