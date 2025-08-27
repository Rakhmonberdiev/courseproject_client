import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/paged-result';
import { InventoryDto } from '../../models/inventory.dto';
import { environment } from '../../../../environments/environment';
import { InvDetailsDto } from '../../models/inv-details.dto';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'inventories';

  getAll(opts: {
    page: number;
    pageSize: number;
    search?: string | null;
  }): Observable<PagedResult<InventoryDto>> {
    let params = new HttpParams()
      .set('page', String(opts.page))
      .set('pageSize', String(opts.pageSize));

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
}
