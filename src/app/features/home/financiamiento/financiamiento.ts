import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { PresupuestoService } from '../../../core/services/presupuesto';
import { TablaDatos, SerieTabla } from '../../../shared/components/tabla-datos/tabla-datos';
import { BarrasApiladas, SerieBarras } from '../../../shared/graficos/barras-apiladas/barras-apiladas';

const COLOR_SERIE: Record<string, string> = {
  'Emisión interna': '#5470c6',
  'Emisión externa': '#73c0de',
  'Amortización interna': '#fac858',
  'Amortización externa': '#fc8452',
};

@Component({
  selector: 'app-financiamiento',
  standalone: true,
  imports: [BarrasApiladas, TablaDatos],
  templateUrl: './financiamiento.html',
  styleUrl: './financiamiento.scss',
})
export class Financiamiento {
  private servicio = inject(PresupuestoService);
  datos = toSignal(this.servicio.obtenerFinanciamiento().pipe(catchError(() => of(null))));

  series = computed<SerieBarras[]>(() =>
    (this.datos()?.series ?? []).map((s) => ({ ...s, color: COLOR_SERIE[s.nombre] })),
  );

  tabla = computed<SerieTabla[]>(() => {
    const d = this.datos();
    return d ? [...d.series, { nombre: 'Endeudamiento neto', datos: d.neto }] : [];
  });

  private formato = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  private formatoSigno = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  });

  pct(v: number | null): string {
    return v === null ? '—' : `${this.formato.format(v)}%`;
  }

  pctSigno(v: number | null): string {
    return v === null ? '—' : `${this.formatoSigno.format(v)}%`;
  }

  entero(v: number | null): string {
    return v === null ? '—' : Math.round(v).toString();
  }
}