import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AreaApilada } from '../../../shared/graficos/area-apilada/area-apilada';
import { TenedoresService } from '../../../core/services/tenedores';
import { TablaDatos } from '../../../shared/components/tabla-datos/tabla-datos';

@Component({
  selector: 'app-gobierno',
  imports: [AreaApilada, TablaDatos],
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