import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
export interface ItemLikeDto {
  itemId: string;
  isDeleted: boolean;
}
@Injectable({ providedIn: 'root' })
export class InvItemService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'api/item';
  toggleLike(itemId: string) {
    return this.http.post<ItemLikeDto>(
      `${this.baseUrl}/like/${itemId}`,
      {},
      { withCredentials: true }
    );
  }
}
