import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { InvDetailsDto } from '../models/inv-details.dto';
import { inject } from '@angular/core';
import { InventoryService } from '../services/fetchDataServices/inventory.service';
import { catchError, of } from 'rxjs';

export const invResolver: ResolveFn<InvDetailsDto | RedirectCommand> = (
  route
) => {
  const invStore = inject(InventoryService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;
  return invStore.getById(id).pipe(
    catchError(() => {
      return of(new RedirectCommand(router.parseUrl('**')));
    })
  );
};
