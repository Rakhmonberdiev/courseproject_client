import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SvgIconService {
  private reg = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private registered = new Set<string>();
  register(names: string | string[]) {
    const list = Array.isArray(names) ? names : [names];
    for (const name of list) {
      if (this.registered.has(name)) continue;
      this.reg.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(`icons/${name}.svg`)
      );
      this.registered.add(name);
    }
  }
}
