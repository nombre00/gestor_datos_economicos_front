import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type UnidadFiscal = 'pct_pib' | 'real' | 'nominal';

export interface SerieFiscalApi {
  nombre: string;
  datos: (number | null)[];
}

export interface EjecucionFiscalApi {
  unidad: UnidadFiscal;
  unidad_etiqueta: string;
  anio_base: number | null;
  categorias: string[];
  ingresos_gastos: SerieFiscalApi[];
  balance: (number | null)[];
  ingresos_por_fuente: SerieFiscalApi[];
  gastos_por_tipo: SerieFiscalApi[];
  intereses: (number | null)[];
  intereses_pct_ingresos: (number | null)[];
  cifras: {
    anio: number;
    balance: number | null;
    intereses: number | null;
    balance_pct_pib: number | null;
    balance_promedio_desde: number;
    balance_promedio_pct_pib: number | null;
    peor_anio: number;
    peor_balance_pct_pib: number;
    ultimo_superavit_anio: number | null;
    ultimo_superavit_pct_pib: number | null;
    intereses_pct_ingresos: number | null;
  };
}

export interface FinanciamientoApi {
  unidad: UnidadFiscal;
  categorias: string[];
  series: SerieFiscalApi[];
  neto: (number | null)[];
  cifras: {
    anio: number;
    emision: number | null;
    amortizacion: number | null;
    neto: number | null;
    balance: number | null;
    pct_refinanciamiento: number | null;
  };
}



@Injectable({ providedIn: 'root' })
export class PresupuestoService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8000/api/presupuesto';

  obtenerEjecucionFiscal(unidad: UnidadFiscal): Observable<EjecucionFiscalApi> {
    const params = new HttpParams().set('unidad', unidad);
    return this.http.get<EjecucionFiscalApi>(`${this.base}/ejecucion-fiscal/`, { params });
  }

  obtenerFinanciamiento(unidad: UnidadFiscal = 'pct_pib'): Observable<FinanciamientoApi> {
    const params = new HttpParams().set('unidad', unidad);
    return this.http.get<FinanciamientoApi>(`${this.base}/financiamiento/`, { params });
  }
}