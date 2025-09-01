import { Component, computed, effect, input, signal } from '@angular/core';
import {
  InventoryService,
  InvItemsSort,
} from '../../common/services/fetchDataServices/inventory.service';
import { InventoryItemDto } from '../../common/models/inventory-item.dto';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inv-items-list',
  imports: [FormsModule, DatePipe],
  templateUrl: './inv-items-list.html',
  styleUrl: './inv-items-list.css',
})
export class InvItemsList {
  invId = input.required<string>();
  page = signal(1);
  pageSize = signal(10);
  sort = signal<InvItemsSort>('CreatedDesc');
  loading = signal(true);
  error = signal<string | null>(null);
  items = signal<InventoryItemDto[]>([]);
  totalCount = signal(0);

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize()))
  );
  hasPrev = computed(() => this.page() > 1);
  hasNext = computed(() => this.page() < this.totalPages());
  constructor(private api: InventoryService) {
    effect(() => {
      const id = this.invId();
      const p = this.page();
      const sz = this.pageSize();
      const s = this.sort();
      if (!id) return;
      this.fetch(id, p, sz, s);
    });
  }
  private fetch(
    id: string,
    page: number,
    pageSize: number,
    sort: InvItemsSort
  ) {
    this.loading.set(true);
    this.error.set(null);

    this.api.getItems(id, { page, pageSize, sort }).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.error.set('Не удалось загрузить предметы.');
        this.loading.set(false);
      },
    });
  }
  // ui handlers
  setSort(val: InvItemsSort) {
    if (this.sort() === val) return;
    this.sort.set(val);
    this.page.set(1); // сбрасываем страницу
  }

  setPageSize(sz: number) {
    if (this.pageSize() === sz) return;
    this.pageSize.set(sz);
    this.page.set(1);
  }

  prev() {
    if (this.hasPrev()) this.page.update((p) => p - 1);
  }
  next() {
    if (this.hasNext()) this.page.update((p) => p + 1);
  }
  fieldValue(f: InventoryItemDto['fields'][number]) {
    switch (f.type) {
      case 1:
      case 2:
        return f.stringValue ?? '';
      case 3:
        return f.numericValue ?? '';
      case 4:
        return f.stringValue ?? '';
      case 5:
        return f.boolValue ?? false ? 'Да' : 'Нет';
      default:
        return '';
    }
  }
}
