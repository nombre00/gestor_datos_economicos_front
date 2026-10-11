import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AreaApilada } from '../../../shared/graficos/area-apilada/area-apilada';
import { TenedoresService } from '../../../core/services/tenedores';

@Component({
  selector: 'app-gobierno',
  imports: [AreaApilada],
  templateUrl: './gobierno.html',
  styleUrl: './gobierno.scss',
})
export class Gobierno {
  private readonly servicio = inject(TenedoresService);

  // undefined = cargando, null = error, objeto = datos listos
  readonly datos = toSignal(
    this.servicio.obtenerGobierno().pipe(catchError(() => of(null))),
  );
}