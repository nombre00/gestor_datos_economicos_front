import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../../core/services/bonos';
import { Dispersion, PuntoDispersion } from '../../../../shared/graficos/dispersion/dispersion';

@Component({
  selector: 'app-bonos-externos-grafico-spread',
  standalone: true,
  imports: [Dispersion],
  templateUrl: './grafico-spread.html',
  styleUrl: './grafico-spread.scss',
})
export class GraficoSpread {
  private bonos = inject(BonosService);
  private datos = toSignal(this.bonos.obtenerSpreadExternos().pipe(catchError(() => of(null))));

  /** undefined = cargando, null = error, arreglo = datos */
  puntos = computed<PuntoDispersion[] | null | undefined>(() => {
    const d = this.datos();
    if (!d) return d;
    return d.map((p) => ({
      x: p.plazo_anios,
      y: p.spread,
      color: p.anio_emision,
      etiqueta: `${p.nombre_bono}${p.es_reapertura ? ' (reapertura)' : ''}`,
    }));
  });
}