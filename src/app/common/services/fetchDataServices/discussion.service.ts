import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedResult } from '../../models/paged-result';
import { DiscussionPostDto } from '../../models/discussion-post.dto';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DiscussionService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + 'discussion';

  getPosts(inventoryId: string, page: number, pageSize: number) {
    return this.http.get<PagedResult<DiscussionPostDto>>(
      `${this.baseUrl}/${inventoryId}`,
      { params: { page, pageSize } }
    );
  }
  addPost(inventoryId: string, markdown: string) {
    return this.http.post<DiscussionPostDto>(
      `${this.baseUrl}/${inventoryId}`,
      { markdown },
      { withCredentials: true }
    );
  }
}
