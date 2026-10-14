import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../core/services/bonos';
import { BarrasApiladas, SerieBarras } from '../../../shared/graficos/barras-apiladas/barras-apiladas';
import { Dona, DatoDona } from '../../../shared/graficos/dona/dona';
import { TablaDatos } from '../../../shared/components/tabla-datos/tabla-datos';

const COLOR = {
  usd: '#5470c6',
  eur: '#91cc75',
  clp: '#ee6666',
  clpClaro: '#f4a3a3',
  clpOscuro: '#b83b3b',
  uf: '#fac858',
  local: '#73c0de',
  externo: '#9a60b4',
};

/** Las series de bonos toman el color de la moneda en que están emitidas */
const COLOR_SERIE: Record<string, string> = {
  'Externos USD': COLOR.usd,
  'Externos EUR': COLOR.eur,
  'Externos CLP': COLOR.clpOscuro,
  'BTP': COLOR.clp,
  'BTU': COLOR.uf,
  'Letras': COLOR.clpClaro,
};

const COLOR_MONEDA: Record<string, string> = {
  'Dólar (USD)': COLOR.usd,
  'Euro (EUR)': COLOR.eur,
  'Pesos (CLP)': COLOR.clp,
  'UF': COLOR.uf,
};

const COLOR_MERCADO: Record<string, string> = {
  'Mercado local': COLOR.local,
  'Mercado externo': COLOR.externo,
};

@Component({
  selector: 'app-panorama',
  standalone: true,
  imports: [BarrasApiladas, Dona, TablaDatos],
  templateUrl: './panorama.html',
  styleUrl: './panorama.scss',
})
export class Panorama {
  private bonos = inject(BonosService);
  datos = toSignal(this.bonos.obtenerPanorama().pipe(catchError(() => of(null))));

  seriesVencimientos = computed<SerieBarras[]>(() =>
    (this.datos()?.vencimientos.series ?? []).map((s) => ({ ...s, color: COLOR_SERIE[s.nombre] })),
  );

  donaMoneda = computed<DatoDona[]>(() =>
    (this.datos()?.composicion_moneda ?? []).map((d) => ({ ...d, color: COLOR_MONEDA[d.nombre] })),
  );

  donaMercado = computed<DatoDona[]>(() =>
    (this.datos()?.composicion_mercado ?? []).map((d) => ({ ...d, color: COLOR_MERCADO[d.nombre] })),
  );

  private formatoUnDecimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  private formatoPeso = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /** Millones de CLP -> billones de CLP (1 billón chileno = 10^12 = 1.000.000 de millones) */
  billones(millones: number): string {
    return this.formatoUnDecimal.format(millones / 1_000_000);
  }

  porcentaje(v: number): string {
    return this.formatoUnDecimal.format(v);
  }

  pesos(v: number): string {
    return this.formatoPeso.format(v);
  }

  fecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}