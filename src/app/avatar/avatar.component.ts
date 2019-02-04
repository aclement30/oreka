import { Component, Input } from '@angular/core';
import { User } from 'app/models/user.model';

@Component({
  selector: 'app-avatar',
  template: `
    <div [style.background-color]="user.color"><span>{{ user.initials }}</span></div>
  `,
  styleUrls: ['./avatar.component.scss'],
})

export class AvatarComponent {
  @Input() user: User;
}
