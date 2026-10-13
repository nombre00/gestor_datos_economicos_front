import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DatosGraficoApi } from './composicion';

export interface BonoExternoApi {
  nombre_bono: string;
  moneda: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  es_reapertura: boolean;
  monto: number;
  tasa_caratula: string;
  spread: number | null;
  spread_nota: string | null;
  yield_emision: number | null;
  vigencia: string;
  vigencia_etiqueta: string;
}

export interface PuntoSpreadApi {
  nombre_bono: string;
  moneda: string;
  plazo_anios: number;
  spread: number;
  anio_emision: number;
  es_reapertura: boolean;
}

export interface BonoLocalApi {
  nombre_bono: string;
  anio: number;
  tipo: string;
  tipo_etiqueta: string;
  unidad: 'clp' | 'uf';
  fecha_emision: string;
  fecha_vencimiento: string;
  es_reapertura: boolean;
  monto: number | null;
  monto_es_colocado: boolean;
  tasa_caratula: number;
  paga_intereses: string | null;
  status: string;
  status_etiqueta: string;
}

export interface VencimientosLocalesApi extends DatosGraficoApi {
  serie_btu_uf: number[];
  fecha_valorizacion: string;
  valor_uf: number;
}

export interface PuntoTasaApi {
  nombre_bono: string;
  tipo: string;
  tipo_etiqueta: string;
  plazo_anios: number;
  tasa: number;
  anio_emision: number;
}


@Injectable({ providedIn: 'root' })
export class BonosService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8000/api/bonos';

  obtenerExternos(): Observable<BonoExternoApi[]> {
    return this.http.get<BonoExternoApi[]>(`${this.base}/externos/`);
  }

  obtenerVencimientosExternos(): Observable<DatosGraficoApi> {
    return this.http.get<DatosGraficoApi>(`${this.base}/externos/vencimientos/`);
  }

  obtenerSpreadExternos(): Observable<PuntoSpreadApi[]> {
    return this.http.get<PuntoSpreadApi[]>(`${this.base}/externos/spread/`);
  }

    obtenerLocales(): Observable<BonoLocalApi[]> {
    return this.http.get<BonoLocalApi[]>(`${this.base}/locales/`);
  }

  obtenerVencimientosLocales(): Observable<VencimientosLocalesApi> {
    return this.http.get<VencimientosLocalesApi>(`${this.base}/locales/vencimientos/`);
  }

  obtenerTasaLocales(): Observable<PuntoTasaApi[]> {
    return this.http.get<PuntoTasaApi[]>(`${this.base}/locales/tasa/`);
  }
}