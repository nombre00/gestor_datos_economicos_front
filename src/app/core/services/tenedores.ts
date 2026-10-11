import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DatosGraficoApi } from './composicion';

@Injectable({ providedIn: 'root' })
export class TenedoresService {
  private readonly http = inject(HttpClient);
  private readonly urlBase = 'http://localhost:8000/api';

  obtenerGobierno(): Observable<DatosGraficoApi> {
    return this.http.get<DatosGraficoApi>(`${this.urlBase}/tenedores/gobierno/`);
  }

  obtenerPlazo(): Observable<DatosGraficoApi> {
    return this.http.get<DatosGraficoApi>(`${this.urlBase}/tenedores/plazo/`);
  }
}