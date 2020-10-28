import { Component, Input } from '@angular/core';

import { User } from '../models/user.model';

@Component({
  selector: 'avatar',
  template: `<div [style.background-color]="user.color"><span>{{ user.initials }}</span></div>`,
  styleUrls: ['./avatar.component.scss']
})

export class AvatarComponent {
  @Input() user: User;
}