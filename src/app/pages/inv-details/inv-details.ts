import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvDetailsDto } from '../../common/models/inv-details.dto';
import { DatePipe, NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-inv-details',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './inv-details.html',
  styleUrl: './inv-details.css',
})
export class InvDetails {
  private route = inject(ActivatedRoute);

  private invData = toSignal(this.route.data);
  private inv$ = this.route.data.pipe(
    map((d) => d['inv'] as InvDetailsDto),
    startWith(null)
  );
  data = toSignal<InvDetailsDto | null>(this.inv$, { initialValue: null });
  loading = computed(() => this.data() === null);
}
