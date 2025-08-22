import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SvgIconService } from '../../../common/services/svgIcon.service';
import { ThemeService } from '../../../common/services/theme.service';
import { LangSwitch } from './lang-switch/lang-switch';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ProfileDropdown } from './profile-dropdown/profile-dropdown';
import { CurrentUserService } from '../../../common/services/auth/current-user.service';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, LangSwitch, TranslateModule, RouterLink, ProfileDropdown],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private iconService = inject(SvgIconService);
  currentUserSvc = inject(CurrentUserService);
  theme = inject(ThemeService);
  ngOnInit(): void {
    this.iconService.register(['sun', 'moon']);
  }
  toggleTheme() {
    this.theme.toggle();
  }
  get currentTheme(): 'light' | 'dark' {
    return this.theme.theme();
  }
}
