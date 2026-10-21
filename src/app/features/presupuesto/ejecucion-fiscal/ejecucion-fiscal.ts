import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { EjecucionFiscalApi, PresupuestoService, UnidadFiscal } from '../../../core/services/presupuesto';
import { TablaDatos, SerieTabla } from '../../../shared/components/tabla-datos/tabla-datos';
import { AreaApilada, SerieGrafico } from '../../../shared/graficos/area-apilada/area-apilada';
import { BarrasApiladas, SerieBarras } from '../../../shared/graficos/barras-apiladas/barras-apiladas';
import { Lineas, SerieLineas } from '../../../shared/graficos/lineas/lineas';

const COLOR = {
  ingresos: '#5470c6',
  gastos: '#fac858',
  superavit: '#91cc75',
  deficit: '#ee6666',
  intereses: '#9a60b4',
};

const UNIDADES: { valor: UnidadFiscal; etiqueta: string }[] = [
  { valor: 'pct_pib', etiqueta: '% del PIB' },
  { valor: 'real', etiqueta: 'Pesos reales' },
  { valor: 'nominal', etiqueta: 'Pesos nominales' },
];

@Component({
  selector: 'app-ejecucion-fiscal',
  standalone: true,
  imports: [Lineas, BarrasApiladas, AreaApilada, TablaDatos],
  templateUrl: './ejecucion-fiscal.html',
  styleUrl: './ejecucion-fiscal.scss',
})
export class EjecucionFiscal {
  private servicio = inject(PresupuestoService);

  readonly unidades = UNIDADES;
  unidad = signal<UnidadFiscal>('pct_pib');

  /** undefined = cargando, null = error, objeto = datos de la unidad elegida */
  datos = toSignal(
    toObservable(this.unidad).pipe(
      switchMap((u) =>
        this.servicio.obtenerEjecucionFiscal(u).pipe(
          map((d): EjecucionFiscalApi | null | undefined => d),
          catchError(() => of(null)),
          startWith(undefined),
        ),
      ),
    ),
    { initialValue: undefined },
  );

  // --- Unidad ---
  esPct = computed(() => this.unidad() === 'pct_pib');
  decimales = computed(() => (this.esPct() ? 1 : 0));
  unidadY = computed(() => (this.esPct() ? '%' : ''));

  etiquetaUnidad = computed(() => {
    const u = this.unidad();
    if (u === 'pct_pib') return '% del PIB';
    if (u === 'real') return `Millones de pesos de ${this.datos()?.anio_base ?? ''}`;
    return 'Millones de pesos de cada año';
  });

  // --- Series para los gráficos ---
  seriesIngresosGastos = computed<SerieLineas[]>(() =>
    (this.datos()?.ingresos_gastos ?? []).map((s, i) => ({
      ...s,
      color: i === 0 ? COLOR.ingresos : COLOR.gastos,
    })),
  );

  /** El balance se parte en dos series para pintar superávit en verde y déficit en rojo */
  seriesBalance = computed<SerieBarras[]>(() => {
    const b = this.datos()?.balance ?? [];
    return [
      { nombre: 'Superávit', datos: b.map((v) => (v !== null && v >= 0 ? v : null)), color: COLOR.superavit },
      { nombre: 'Déficit', datos: b.map((v) => (v !== null && v < 0 ? v : null)), color: COLOR.deficit },
    ];
  });

  tablaIngresosGastos = computed<SerieTabla[]>(() => {
    const d = this.datos();
    return d ? [...d.ingresos_gastos, { nombre: 'Balance', datos: d.balance }] : [];
  });

  seriesIngresos = computed<SerieGrafico[]>(() => this.datos()?.ingresos_por_fuente ?? []);
  seriesGastos = computed<SerieGrafico[]>(() => this.datos()?.gastos_por_tipo ?? []);

  seriesIntereses = computed<SerieLineas[]>(() => {
    const d = this.datos();
    return d ? [{ nombre: 'Intereses', datos: d.intereses, color: COLOR.intereses }] : [];
  });

  seriesInteresesRatio = computed<SerieLineas[]>(() => {
    const d = this.datos();
    return d ? [{ nombre: 'Intereses / total ingresos', datos: d.intereses_pct_ingresos, color: COLOR.intereses }] : [];
  });

  tablaIntereses = computed<SerieTabla[]>(() => {
    const d = this.datos();
    return d
      ? [
          { nombre: `Intereses (${this.etiquetaUnidad()})`, datos: d.intereses },
          { nombre: 'Intereses (% de los ingresos)', datos: d.intereses_pct_ingresos },
        ]
      : [];
  });

  // --- Formatos para las cifras clave ---
  private formatoUnDecimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  private formatoConSigno = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  });

  /** Valor en la unidad elegida: "−2,8%" o "−9,9 billones" (1 billón = 1.000.000 de millones) */
  monto(v: number | null, conSigno = false): string {
    if (v === null) return '—';
    const formato = conSigno ? this.formatoConSigno : this.formatoUnDecimal;
    return this.esPct() ? `${formato.format(v)}%` : `${formato.format(v / 1_000_000)} billones`;
  }

  /** Valor siempre en % del PIB, con signo */
  pctPib(v: number | null): string {
    return v === null ? '—' : `${this.formatoConSigno.format(v)}%`;
  }

  porcentaje(v: number | null): string {
    return v === null ? '—' : `${this.formatoUnDecimal.format(v)}%`;
  }

  detalleMonto = computed(() => {
    const u = this.unidad();
    if (u === 'pct_pib') return 'del PIB';
    if (u === 'real') return `de pesos de ${this.datos()?.anio_base ?? ''}`;
    return 'de pesos de cada año';
  });
}