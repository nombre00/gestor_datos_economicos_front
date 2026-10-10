import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Lineas } from '../../../shared/graficos/lineas/lineas';
import { SerieHistoricaService } from '../../../core/services/serie-historica';

@Component({
  selector: 'app-grafico-evolucion',
  imports: [Lineas],
  templateUrl: './grafico-evolucion.html',
  styleUrl: './grafico-evolucion.scss',
})
export class GraficoEvolucion {
  private readonly servicio = inject(SerieHistoricaService);

  // undefined = cargando, null = error, objeto = datos listos
  readonly datos = toSignal(
    this.servicio.obtenerEvolucion('usd').pipe(catchError(() => of(null))),
  );
}