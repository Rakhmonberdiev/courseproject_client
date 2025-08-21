import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly storageKey = 'app_lang';
  private readonly supported = ['ru', 'en'] as const;
  private translate = inject(TranslateService);
  private _lang = signal<'ru' | 'en'>('ru');
  lang = this._lang.asReadonly();
  init() {
    this.translate.addLangs(this.supported as any);

    const saved = localStorage.getItem(this.storageKey);
    const browser = this.normalize(this.translate.getBrowserLang());
    const toUse = this.normalize(saved) ?? browser ?? 'ru';

    this.use(toUse as 'ru' | 'en');
  }

  current() {
    return this._lang();
  }

  use(lang: string) {
    const normalized = this.normalize(lang) ?? 'ru';
    this._lang.set(normalized as 'ru' | 'en');
    this.translate.use(normalized);
    localStorage.setItem(this.storageKey, normalized);
    document.documentElement.setAttribute('lang', normalized);
  }

  languages() {
    return [
      { code: 'ru', label: 'Русский' },
      { code: 'en', label: 'English' },
    ];
  }
  private normalize(lang?: string | null) {
    if (!lang) return null;
    const short = lang.toLowerCase().slice(0, 2);
    return this.supported.includes(short as any) ? short : null;
  }
}
