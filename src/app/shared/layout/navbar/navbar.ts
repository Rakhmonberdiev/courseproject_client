import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SvgIconService } from '../../../services/svgIcon.service';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  currentTheme: 'light' | 'dark' = 'light';
  private iconService = inject(SvgIconService);
  private navIcons = ['sun', 'moon'];
  ngOnInit(): void {
    this.iconService.register(this.navIcons);
    this.initTheme();
  }
  private initTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    this.currentTheme = savedTheme || 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
}
