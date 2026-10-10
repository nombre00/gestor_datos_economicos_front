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

@Injectable({ providedIn: 'root' })
export class SerieHistoricaService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8000/api';

  obtenerEvolucion(moneda: 'usd' | 'clp' = 'usd'): Observable<EvolucionApi> {
    return this.http.get<EvolucionApi>(`${this.urlBase}/serie-historica/`, {
      params: { moneda },
    });
  }
}