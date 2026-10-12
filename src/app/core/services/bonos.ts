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
}