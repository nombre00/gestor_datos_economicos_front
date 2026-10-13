import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../../core/services/bonos';
import { BarrasApiladas, SerieBarras } from '../../../../shared/graficos/barras-apiladas/barras-apiladas';

/** Mismos colores que el gráfico de BTU en UF y el de tasa vs plazo de esta página */
const COLOR_TIPO: Record<string, string> = {
  'Bono de Tesorería en UF': '#5470c6',
  'Bono de Tesorería en Pesos': '#91cc75',
  'Letra del Tesoro': '#6e7079',
};

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

  seriesClp = computed<SerieBarras[]>(() =>
    (this.datos()?.series ?? []).map((s) => ({ ...s, color: COLOR_TIPO[s.nombre] })),
  );

  serieBtu = computed<SerieBarras[]>(() => {
    const d = this.datos();
    return d
      ? [{ nombre: 'Bono de Tesorería en UF', datos: d.serie_btu_uf, color: COLOR_TIPO['Bono de Tesorería en UF'] }]
      : [];
  });
}