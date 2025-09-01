import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscussionService } from '../../common/services/fetchDataServices/discussion.service';
import { DiscussionPostDto } from '../../common/models/discussion-post.dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PagedResult } from '../../common/models/paged-result';
import { DatePipe } from '@angular/common';
import { CurrentUserService } from '../../common/services/auth/current-user.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-discussions-list',
  imports: [DatePipe, FormsModule],
  templateUrl: './discussions-list.html',
  styleUrl: './discussions-list.css',
})
export class DiscussionsList implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private api = inject(DiscussionService);
  private destroyRef = inject(DestroyRef);
  currentUser = inject(CurrentUserService);
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  msg = signal<string>('');
  sending = signal<boolean>(false);
  invId = signal<string>('');
  page = signal<number>(1);
  pageSize = 10;

  posts = signal<DiscussionPostDto[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(false);
  isScrolling = false;
  hasMore = signal<boolean>(true);
  private scrollSubscription: any;
  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pm) => {
        const id = pm.get('id') ?? pm.get('invId') ?? '';
        this.invId.set(id);
        this.resetAndLoad();
      });
  }
  ngAfterViewInit() {
    // Подписываемся на события скролла с debounce для оптимизации
    this.scrollSubscription = fromEvent(
      this.scrollContainer.nativeElement,
      'scroll'
    )
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onScroll());
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
  private onScroll() {
    const element = this.scrollContainer.nativeElement;
    if (element.scrollTop < 144 && this.hasMore() && !this.loading()) {
      this.loadNextPage();
    }
  }
  private resetAndLoad() {
    this.page.set(1);
    this.posts.set([]);
    this.total.set(0);
    this.loadPage(this.page()).then(() => {
      this.scrollToBottom();
    });
  }

  private async loadPage(pageNum: number): Promise<void> {
    if (this.loading() || !this.hasMore()) return Promise.resolve();

    this.loading.set(true);

    return new Promise((resolve) => {
      this.api.getPosts(this.invId(), pageNum, this.pageSize).subscribe({
        next: (res: PagedResult<DiscussionPostDto>) => {
          this.total.set(res.totalCount);

          if (res.items.length === 0) {
            this.hasMore.set(false);
            this.loading.set(false);
            resolve();
            return;
          }
          const asc = [...res.items].reverse();
          if (pageNum === 1) {
            this.posts.set(asc);
          } else {
            const scrollContainer = this.scrollContainer.nativeElement;
            const oldScrollHeight = scrollContainer.scrollHeight;
            const oldScrollTop = scrollContainer.scrollTop;

            this.posts.update((old) => [...asc, ...old]);
            setTimeout(() => {
              scrollContainer.scrollTop =
                scrollContainer.scrollHeight - oldScrollHeight + oldScrollTop;
              this.loading.set(false);
              resolve();
            });
          }

          if (res.items.length < this.pageSize) {
            this.hasMore.set(false);
          }

          if (pageNum === 1) {
            this.loading.set(false);
            resolve();
          }
        },
        error: () => {
          this.loading.set(false);
          resolve();
        },
      });
    });
  }
  private loadNextPage() {
    const nextPage = this.page() + 1;
    this.page.set(nextPage);
    this.loadPage(nextPage);
  }

  private scrollToBottom() {
    setTimeout(() => {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    });
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  send() {
    if (this.sending()) return;
    const text = this.msg().trim();
    if (!this.currentUser.currentUser$() || text.length === 0) return;

    this.sending.set(true);
    this.api.addPost(this.invId(), text).subscribe({
      next: (created) => {
        this.posts.update((old) => [...old, created]);
        this.total.update((t) => t + 1);
        this.msg.set('');
        this.sending.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.sending.set(false);
      },
    });
  }
}
