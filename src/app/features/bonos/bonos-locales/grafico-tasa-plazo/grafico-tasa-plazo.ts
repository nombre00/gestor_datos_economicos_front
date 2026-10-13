import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../../core/services/bonos';
import { Dispersion, PuntoDispersion } from '../../../../shared/graficos/dispersion/dispersion';

@Component({
  selector: 'app-bonos-locales-grafico-tasa-plazo',
  standalone: true,
  imports: [Dispersion],
  templateUrl: './grafico-tasa-plazo.html',
  styleUrl: './grafico-tasa-plazo.scss',
})
export class GraficoTasaPlazo {
  private bonos = inject(BonosService);
  private datos = toSignal(this.bonos.obtenerTasaLocales().pipe(catchError(() => of(null))));

  /** undefined = cargando, null = error, arreglo = datos */
  puntos = computed<PuntoDispersion[] | null | undefined>(() => {
    const d = this.datos();
    if (!d) return d;
    return d.map((p) => ({
      x: p.plazo_anios,
      y: p.tasa,
      color: p.anio_emision,
      etiqueta: `${p.nombre_bono} (emitido ${p.anio_emision})`,
      grupo: p.tipo_etiqueta,
    }));
  });
}