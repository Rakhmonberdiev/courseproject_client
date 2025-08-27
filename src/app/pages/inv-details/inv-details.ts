import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InventoryService } from '../../common/services/fetchDataServices/inventory.service';
import { InvDetailsDto } from '../../common/models/inv-details.dto';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-inv-details',
  imports: [DatePipe, NgClass, RouterLink],
  templateUrl: './inv-details.html',
  styleUrl: './inv-details.css',
})
export class InvDetails {
  private route = inject(ActivatedRoute);
  private service = inject(InventoryService);

  loading = signal(true);
  data = signal<InvDetailsDto | null>(null);
  constructor() {
    this.route.paramMap;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.fetch(id);
  }
  private fetch(id: string) {
    this.loading.set(true);

    this.service.getById(id).subscribe({
      next: (dto) => {
        this.data.set(dto);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
