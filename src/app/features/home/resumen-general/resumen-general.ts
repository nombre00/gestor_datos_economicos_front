import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../core/services/bonos';
import { SerieHistoricaService } from '../../../core/services/serie-historica';

@Component({
  selector: 'app-resumen-general',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resumen-general.html',
  styleUrl: './resumen-general.scss',
})
export class ResumenGeneral {
  private serie = inject(SerieHistoricaService);
  private bonos = inject(BonosService);

  resumen = toSignal(this.serie.obtenerResumen().pipe(catchError(() => of(null))));
  private panorama = toSignal(this.bonos.obtenerPanorama().pipe(catchError(() => of(null))));

  /** undefined = cargando, null = error, objeto = tramo de 1 año */
  vence12Meses = computed(() => {
    const p = this.panorama();
    if (!p) return p;
    return p.cifras.tramos.find((t) => t.anios === 1) ?? null;
  });

  private formatoUnDecimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  private formatoEntero = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

  pct(v: number | null): string {
    return v === null ? '—' : `${this.formatoUnDecimal.format(v)}%`;
  }

  puntos(v: number): string {
    const signo = v > 0 ? '+' : '';
    return `${signo}${this.formatoUnDecimal.format(v)} pp`;
  }

  millonesUsd(v: number): string {
    return this.formatoEntero.format(v);
  }

  /** Millones de CLP -> billones de CLP */
  billones(millones: number): string {
    return this.formatoUnDecimal.format(millones / 1_000_000);
  }

  fecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}