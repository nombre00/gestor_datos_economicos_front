import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AreaApilada } from '../../../shared/graficos/area-apilada/area-apilada';
import { ComposicionService } from '../../../core/services/composicion';

@Component({
  selector: 'app-por-acreedor',
  imports: [AreaApilada],
  templateUrl: './por-acreedor.html',
  styleUrl: './por-acreedor.scss',
})
export class PorAcreedor {
  private readonly servicio = inject(ComposicionService);

  // undefined = cargando, null = error, objeto = datos listos
  readonly datos = toSignal(
    this.servicio.obtenerPorAcreedor().pipe(catchError(() => of(null))),
  );
}