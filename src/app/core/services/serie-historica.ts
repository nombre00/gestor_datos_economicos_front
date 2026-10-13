import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SerieHistoricaApi {
  nombre: string;
  datos: (number | null)[];
}

export interface EvolucionApi {
  categorias: string[];
  series: SerieHistoricaApi[];
}

export interface CorteDeudaApi {
  fecha_corte: string;
  es_corte_parcial: boolean;
  monto_millones_usd: number;
  pct_pib: number | null;
}

export interface ResumenDeudaApi {
  bruta: CorteDeudaApi;
  neta: CorteDeudaApi | null;
  cambio_bruta: { puntos: number; desde: string; hasta: string } | null;
  minimo_bruta: { pct_pib: number; anio: number } | null;
}


@Injectable({ providedIn: 'root' })
export class SerieHistoricaService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8000/api';

  obtenerEvolucion(moneda: 'usd' | 'clp' = 'usd'): Observable<EvolucionApi> {
    return this.http.get<EvolucionApi>(`${this.urlBase}/serie-historica/`, {
      params: { moneda },
    });
  }

  obtenerResumen(): Observable<ResumenDeudaApi> {
    return this.http.get<ResumenDeudaApi>('http://localhost:8000/api/serie-historica/resumen/');
  }
}