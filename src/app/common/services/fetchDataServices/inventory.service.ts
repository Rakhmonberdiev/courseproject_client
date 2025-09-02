import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/paged-result';
import { InventoryDto } from '../../models/inventory.dto';
import { environment } from '../../../../environments/environment';
import { InvDetailsDto } from '../../models/inv-details.dto';
import { InventoryItemDto } from '../../models/inventory-item.dto';

export type InvItemsSort = 'CreatedDesc' | 'CreatedAsc' | 'Popular';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'api/inventories';

  getAll(opts: {
    page: number;
    pageSize: number;
    myOnly: boolean;
    search?: string | null;
  }): Observable<PagedResult<InventoryDto>> {
    let params = new HttpParams()
      .set('page', String(opts.page))
      .set('pageSize', String(opts.pageSize))
      .set('myOnly', String(opts.myOnly));

    if (opts.search && opts.search.trim().length >= 2) {
      params = params.set('search', opts.search.trim());
    }

    return this.http.get<PagedResult<InventoryDto>>(this.baseUrl, {
      params,
      withCredentials: true,
    });
  }
  getById(id: string): Observable<InvDetailsDto> {
    return this.http.get<InvDetailsDto>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getItems(
    invId: string,
    opts: { page?: number; pageSize?: number; sort?: InvItemsSort } = {}
  ) {
    let params = new HttpParams();
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.pageSize) params = params.set('pageSize', String(opts.pageSize));
    if (opts.sort) params = params.set('sort', opts.sort);

    return this.http.get<PagedResult<InventoryItemDto>>(
      `${this.baseUrl}/${invId}/items`,
      { params, withCredentials: true }
    );
  }
}
