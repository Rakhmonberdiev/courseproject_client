import { Component, inject } from '@angular/core';
import { LangService } from '../../../../common/services/lang.service';

@Component({
  selector: 'app-lang-switch',
  imports: [],
  templateUrl: './lang-switch.html',
  styleUrl: './lang-switch.css',
})
export class LangSwitch {
  langSvc = inject(LangService);
  langs = this.langSvc.languages();

  use(code: string) {
    this.langSvc.use(code);
    this.blurActive();
  }

  current() {
    return this.langSvc.current();
  }

  private blurActive() {
    const el = document.activeElement as HTMLElement | null;
    el?.blur();
  }
}
