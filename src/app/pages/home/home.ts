import { Component, computed, inject, signal } from '@angular/core';
import { InventoryService } from '../../common/services/fetchDataServices/inventory.service';
import { PagedResult } from '../../common/models/paged-result';
import { InventoryDto } from '../../common/models/inventory.dto';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CurrentUserService } from '../../common/services/auth/current-user.service';
@Component({
  selector: 'app-home',
  imports: [FormsModule, TranslateModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private service = inject(InventoryService);
  page = signal(1);
  pageSize = signal(10);

  searchRaw = signal('');
  search = signal('');
  myOnly = signal(false);
  data = signal<PagedResult<InventoryDto> | null>(null);
  items = computed(() => this.data()?.items ?? []);
  totalCount = computed(() => this.data()?.totalCount ?? 0);

  loading = signal(false);
  error = signal<string | null>(null);

  totalPages = computed(() => {
    const total = this.totalCount();
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });
  currentUserService = inject(CurrentUserService);
  constructor() {
    toObservable(this.searchRaw)
      .pipe(
        map((t) => t.trim()),
        filter((t) => t.length === 0 || t.length >= 2),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((t) => {
        this.search.set(t);
        this.page.set(1);
      });
    const queryParams = computed(() => ({
      page: this.page(),
      pageSize: this.pageSize(),
      search: this.search(),
      myOnly: this.myOnly(),
    }));
    toObservable(queryParams)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((q) =>
          this.service.getAll(q).pipe(
            tap({
              next: (res) => {
                this.data.set(res);
                const tp = Math.max(
                  1,
                  Math.ceil(res.totalCount / res.pageSize)
                );
                if (res.page > tp && tp !== this.page()) this.page.set(tp);
              },
              error: (err) =>
                this.error.set(err?.message ?? 'Не удалось загрузить данные'),
            }),
            finalize(() => this.loading.set(false))
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();
  }
  onToggleMyOnly(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.myOnly.set(isChecked);
  }
  onSearchInput(v: string) {
    this.searchRaw.set(v);
  }

  setPage(p: number) {
    const tp = this.totalPages();
    if (p < 1 || p > tp) return;
    this.page.set(p);
  }

  nextPage() {
    this.setPage(this.page() + 1);
  }
  prevPage() {
    this.setPage(this.page() - 1);
  }
}
