import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../../core/services/bonos';
import { BarrasApiladas, SerieBarras } from '../../../../shared/graficos/barras-apiladas/barras-apiladas';

@Component({
  selector: 'app-bonos-locales-grafico-vencimientos',
  standalone: true,
  imports: [BarrasApiladas],
  templateUrl: './grafico-vencimientos.html',
  styleUrl: './grafico-vencimientos.scss',
})
export class GraficoVencimientos {
  private bonos = inject(BonosService);
  datos = toSignal(this.bonos.obtenerVencimientosLocales().pipe(catchError(() => of(null))));

  private formatoUf = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  etiquetaClp = computed(() => {
    const d = this.datos();
    if (!d) return '';
    const [anio, mes, dia] = d.fecha_valorizacion.split('-');
    return `Millones de CLP (BTU a UF $${this.formatoUf.format(d.valor_uf)} del ${dia}-${mes}-${anio})`;
  });

  serieBtu = computed<SerieBarras[]>(() => {
    const d = this.datos();
    return d ? [{ nombre: 'Bono de Tesorería en UF', datos: d.serie_btu_uf }] : [];
  });
}