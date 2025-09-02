import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
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
import { DiscussionHubService } from '../../common/services/hubs/discussion-hub.service';

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
  private hubSvc = inject(DiscussionHubService);
  msg = signal<string>('');
  sending = signal<boolean>(false);
  invId = signal<string>('');
  page = signal<number>(1);
  pageSize = 10;

  posts = signal<DiscussionPostDto[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(false);
  end = signal<boolean>(false);
  private scrollSubscription: any;
  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pm) => {
        const id = pm.get('id') ?? pm.get('invId') ?? '';
        this.invId.set(id);
        this.hubSvc.connect(id);
        this.resetAndLoad();
      });
    effect(() => {
      const post = this.hubSvc.newPost();
      if (post) {
        this.posts.update((old) => [...old, post]);
        this.total.update((t) => t + 1);
        this.scrollToBottom();
        this.hubSvc.newPost.set(null);
      }
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
    this.hubSvc.disconnect();
  }
  private onScroll() {
    const element = this.scrollContainer.nativeElement;
    if (element.scrollTop < 144 && !this.loading() && !this.end()) {
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
    if (this.loading()) return Promise.resolve();

    this.loading.set(true);

    return new Promise((resolve) => {
      this.api.getPosts(this.invId(), pageNum, this.pageSize).subscribe({
        next: (res: PagedResult<DiscussionPostDto>) => {
          this.total.set(res.totalCount);

          if (res.items.length === 0) {
            this.loading.set(false);
            resolve();
            this.end.set(true);
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
      next: () => {
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
