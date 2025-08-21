import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SvgIconService } from '../../../common/services/svgIcon.service';
import { ThemeService } from '../../../common/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private iconService = inject(SvgIconService);
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
