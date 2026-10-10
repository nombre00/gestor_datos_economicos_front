import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SerieApi {
  nombre: string;
  datos: number[];
}

export interface DatosGraficoApi {
  categorias: string[];
  series: SerieApi[];
}

@Injectable({ providedIn: 'root' })
export class ComposicionService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8000/api';

  obtenerPorAcreedor(): Observable<DatosGraficoApi> {
    return this.http.get<DatosGraficoApi>(`${this.urlBase}/composicion/acreedor/`);
  }

  obtenerPorMoneda(): Observable<DatosGraficoApi> {
    return this.http.get<DatosGraficoApi>(`${this.urlBase}/composicion/moneda/`);
  }
}