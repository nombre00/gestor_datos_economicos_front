import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../core/services/bonos';
import { TablaDatos, SerieTabla } from '../../../shared/components/tabla-datos/tabla-datos';
import { BarrasApiladas, SerieBarras } from '../../../shared/graficos/barras-apiladas/barras-apiladas';
import { Dona, DatoDona } from '../../../shared/graficos/dona/dona';

const COLOR = {
  usd: '#5470c6',
  eur: '#91cc75',
  clp: '#ee6666',
  clpClaro: '#f4a3a3',
  clpOscuro: '#b83b3b',
  uf: '#fac858',
  local: '#73c0de',
  externo: '#9a60b4',
  costo: '#5b6ee1',
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

/** Nombre por moneda (más claro que el nombre del instrumento) para el tooltip */
const NOMBRE_MONEDA: Record<string, string> = {
  'Externos USD': 'Dólar',
  'Externos EUR': 'Euro',
  'Externos CLP': 'Pesos (externo)',
  'BTP': 'Pesos (BTP)',
  'BTU': 'UF (BTU)',
};

/** Estilos en línea: ECharts dibuja el tooltip fuera del componente, no le llegan las clases */
const ESTILO = {
  tabla: 'border-collapse:collapse;margin-top:6px',
  encabezado: 'color:#6b7280;font-size:11px;font-weight:600',
  celdaIzq: 'text-align:left;padding:2px 10px 2px 0',
  celdaDer: 'text-align:right;padding:2px 0 2px 10px',
  punto: 'display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px',
};

interface Supuestos {
  inflacionChile: number;
  inflacionUsa: number;
  inflacionEuro: number;
}

/** Valores por defecto. Chile: ~4% actual. EE.UU.: IPC anual agosto 2026 (3,4%).
 *  Zona euro: estimación flash septiembre 2026 de Eurostat (3,8%). */
const VALORES_ACTUALES: Supuestos = { inflacionChile: 4.0, inflacionUsa: 3.4, inflacionEuro: 3.8 };

/** Escenario de largo plazo: metas del Banco Central de Chile, la Fed y el BCE */
const METAS_BANCOS_CENTRALES: Supuestos = { inflacionChile: 3.0, inflacionUsa: 2.0, inflacionEuro: 2.0 };

const LIMITE_MIN = 0;
const LIMITE_MAX = 15;

/** Lleva la tasa de una serie a costo nominal equivalente en pesos (en %).
 *  Fórmula exacta (multiplicativa), no la suma aproximada. */
function aNominalPesos(serie: string, tasa: number, s: Supuestos): number | null {
  const r = tasa / 100;
  const piChile = s.inflacionChile / 100;
  switch (serie) {
    case 'BTP':
    case 'Externos CLP':
      return tasa;
    case 'BTU':
      return ((1 + r) * (1 + piChile) - 1) * 100;
    case 'Externos USD': {
      const depreciacion = (1 + piChile) / (1 + s.inflacionUsa / 100) - 1;
      return ((1 + r) * (1 + depreciacion) - 1) * 100;
    }
    case 'Externos EUR': {
      const depreciacion = (1 + piChile) / (1 + s.inflacionEuro / 100) - 1;
      return ((1 + r) * (1 + depreciacion) - 1) * 100;
    }
    default:
      return null;
  }
}



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

  // --- Supuestos editables por el usuario ---
  readonly limiteMin = LIMITE_MIN;
  readonly limiteMax = LIMITE_MAX;
  inflacionChile = signal(VALORES_ACTUALES.inflacionChile);
  inflacionUsa = signal(VALORES_ACTUALES.inflacionUsa);
  inflacionEuro = signal(VALORES_ACTUALES.inflacionEuro);

  private supuestos = computed<Supuestos>(() => ({
    inflacionChile: this.inflacionChile(),
    inflacionUsa: this.inflacionUsa(),
    inflacionEuro: this.inflacionEuro(),
  }));

  actualizar(campo: 'chile' | 'usa' | 'euro', evento: Event): void {
    const valor = parseFloat((evento.target as HTMLInputElement).value);
    if (Number.isNaN(valor)) return;
    const acotado = Math.min(LIMITE_MAX, Math.max(LIMITE_MIN, valor));
    if (campo === 'chile') this.inflacionChile.set(acotado);
    else if (campo === 'usa') this.inflacionUsa.set(acotado);
    else this.inflacionEuro.set(acotado);
  }

  usarValoresActuales(): void {
    this.aplicar(VALORES_ACTUALES);
  }

  usarMetas(): void {
    this.aplicar(METAS_BANCOS_CENTRALES);
  }

  private aplicar(s: Supuestos): void {
    this.inflacionChile.set(s.inflacionChile);
    this.inflacionUsa.set(s.inflacionUsa);
    this.inflacionEuro.set(s.inflacionEuro);
  }

  textoSupuestos = computed(() => {
    const s = this.supuestos();
    return `Supuestos: inflación Chile ${this.porcentaje(s.inflacionChile)}%, `
      + `EE.UU. ${this.porcentaje(s.inflacionUsa)}%, zona euro ${this.porcentaje(s.inflacionEuro)}%`;
  });

  // --- Costo nominal equivalente en pesos, ponderado por monto, por año ---
  costo = computed(() => {
    const d = this.datos();
    if (!d) return null;
    const s = this.supuestos();
    const categorias = d.tasas.categorias;
    const series = d.tasas.series;

    const promedio: (number | null)[] = [];
    const detalle: string[] = [];
    const porSerie = series.map((se) => ({ nombre: se.nombre, datos: [] as (number | null)[] }));

    categorias.forEach((_, i) => {
      let sumaPonderada = 0;
      let sumaMontos = 0;
      const filas: { serie: string; tasa: number; equivalente: number; monto: number }[] = [];

      series.forEach((se, j) => {
        const tasa = se.datos[i];
        const monto = se.montos[i];
        const equivalente = tasa === null ? null : aNominalPesos(se.nombre, tasa, s);
        porSerie[j].datos.push(equivalente);
        if (tasa === null || equivalente === null || !monto) return;

        sumaPonderada += equivalente * monto;
        sumaMontos += monto;
        filas.push({ serie: se.nombre, tasa, equivalente, monto });
      });

      promedio.push(sumaMontos ? sumaPonderada / sumaMontos : null);
      detalle.push(sumaMontos ? this.tablaTooltip(filas, sumaMontos, s) : '');
    });

    return { categorias, promedio, detalle, porSerie };
  });

  /** Arma el desglose del tooltip: una fila por moneda */
  private tablaTooltip(
    filas: { serie: string; tasa: number; equivalente: number; monto: number }[],
    total: number,
    s: Supuestos,
  ): string {
    const encabezado = `
      <tr style="${ESTILO.encabezado}">
        <td style="${ESTILO.celdaIzq}">Moneda</td>
        <td style="${ESTILO.celdaDer}">Tasa</td>
        <td style="${ESTILO.celdaIzq};padding-left:10px">Ajuste</td>
        <td style="${ESTILO.celdaDer}">En pesos</td>
        <td style="${ESTILO.celdaDer}">% del monto</td>
      </tr>`;

    const cuerpo = filas
      .sort((a, b) => b.monto - a.monto)
      .map((f) => `
        <tr>
          <td style="${ESTILO.celdaIzq}">
            <span style="${ESTILO.punto};background:${COLOR_SERIE[f.serie] ?? '#999'}"></span>${NOMBRE_MONEDA[f.serie] ?? f.serie}
          </td>
          <td style="${ESTILO.celdaDer}">${this.dosDecimales(f.tasa)}%${f.serie === 'BTU' ? ' real' : ''}</td>
          <td style="${ESTILO.celdaIzq};padding-left:10px">${this.textoAjuste(f.serie, s)}</td>
          <td style="${ESTILO.celdaDer}"><b>${this.dosDecimales(f.equivalente)}%</b></td>
          <td style="${ESTILO.celdaDer}">${this.porcentaje((f.monto / total) * 100)}%</td>
        </tr>`)
      .join('');

    return `Monto que vence: ${this.enteros(total)} millones de CLP`
      + `<table style="${ESTILO.tabla}">${encabezado}${cuerpo}</table>`;
  }

  /** Qué supuesto se aplica a cada moneda para llevarla a pesos */
  private textoAjuste(serie: string, s: Supuestos): string {
    const piChile = s.inflacionChile / 100;
    switch (serie) {
      case 'BTU':
        return `+ inflación ${this.porcentaje(s.inflacionChile)}%`;
      case 'Externos USD':
        return `+ depreciación ${this.porcentaje(((1 + piChile) / (1 + s.inflacionUsa / 100) - 1) * 100)}%`;
      case 'Externos EUR':
        return `+ depreciación ${this.porcentaje(((1 + piChile) / (1 + s.inflacionEuro / 100) - 1) * 100)}%`;
      default:
        return 'sin ajuste';
    }
  }

  serieCosto = computed<SerieBarras[]>(() => {
    const c = this.costo();
    return c
      ? [{
          nombre: 'Costo promedio en pesos',
          datos: c.promedio,
          color: COLOR.costo,
          detalle: c.detalle,
        }]
      : [];
  });

  tablaCosto = computed<SerieTabla[]>(() => {
    const c = this.costo();
    if (!c) return [];
    return [
      { nombre: 'Promedio ponderado', datos: c.promedio },
      ...c.porSerie.map((p) => ({ nombre: `${p.nombre} (en pesos)`, datos: p.datos })),
    ];
  });

  // --- Vencimientos y composición ---
  seriesVencimientos = computed<SerieBarras[]>(() =>
    (this.datos()?.vencimientos.series ?? []).map((s) => ({ ...s, color: COLOR_SERIE[s.nombre] })),
  );

  donaMoneda = computed<DatoDona[]>(() =>
    (this.datos()?.composicion_moneda ?? []).map((d) => ({ ...d, color: COLOR_MONEDA[d.nombre] })),
  );

  donaMercado = computed<DatoDona[]>(() =>
    (this.datos()?.composicion_mercado ?? []).map((d) => ({ ...d, color: COLOR_MERCADO[d.nombre] })),
  );

  // --- Formatos ---
  private formatoEntero = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
  private formatoUnDecimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  private formatoDosDecimales = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /** Millones de CLP -> billones de CLP (1 billón chileno = 10^12 = 1.000.000 de millones) */
  billones(millones: number): string {
    return this.formatoUnDecimal.format(millones / 1_000_000);
  }

  porcentaje(v: number): string {
    return this.formatoUnDecimal.format(v);
  }

  pesos(v: number): string {
    return this.formatoDosDecimales.format(v);
  }

  private enteros(v: number): string {
    return this.formatoEntero.format(v);
  }

  private dosDecimales(v: number): string {
    return this.formatoDosDecimales.format(v);
  }

  fecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}-${mes}-${anio}`;
  }
}