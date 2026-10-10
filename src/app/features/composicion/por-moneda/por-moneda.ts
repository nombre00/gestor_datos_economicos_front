import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AreaApilada } from '../../../shared/graficos/area-apilada/area-apilada';
import { ComposicionService } from '../../../core/services/composicion';

@Component({
  selector: 'app-por-moneda',
  imports: [AreaApilada],
  templateUrl: './por-moneda.html',
  styleUrl: './por-moneda.scss',
})
export class PorMoneda {
  private readonly servicio = inject(ComposicionService);

  // undefined = cargando, null = error, objeto = datos listos
  readonly datos = toSignal(
    this.servicio.obtenerPorMoneda().pipe(catchError(() => of(null))),
  );
}