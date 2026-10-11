import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AreaApilada } from '../../../shared/graficos/area-apilada/area-apilada';
import { TenedoresService } from '../../../core/services/tenedores';

@Component({
  selector: 'app-plazo',
  imports: [AreaApilada],
  templateUrl: './plazo.html',
  styleUrl: './plazo.scss',
})
export class Plazo {
  private readonly servicio = inject(TenedoresService);

  readonly datos = toSignal(
    this.servicio.obtenerPlazo().pipe(catchError(() => of(null))),
  );
}