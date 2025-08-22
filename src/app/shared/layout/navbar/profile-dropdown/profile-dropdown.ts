import { Component, inject } from '@angular/core';
import { CurrentUserService } from '../../../../common/services/auth/current-user.service';
import { SvgIconService } from '../../../../common/services/svgIcon.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-dropdown',
  imports: [MatIcon],
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.css',
})
export class ProfileDropdown {
  currenUserService = inject(CurrentUserService);
  private iconService = inject(SvgIconService);
  constructor() {
    this.iconService.register('logout');
  }
  blurActive() {
    const el = document.activeElement as HTMLElement | null;
    el?.blur();
  }
  logout() {
    if (!this.currenUserService.isAuthenticated()) return;
    this.currenUserService.logout().subscribe({
      next: () => {},
      error: (err) => {
        console.error('Logout error', err);
      },
    });
    this.blurActive();
  }
}
