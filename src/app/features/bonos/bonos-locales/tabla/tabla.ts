import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonoLocalApi, BonosService } from '../../../../core/services/bonos';

@Component({
  selector: 'app-bonos-locales-tabla',
  standalone: true,
  imports: [],
  templateUrl: './tabla.html',
  styleUrl: './tabla.scss',
})
export class Tabla {
  private bonos = inject(BonosService);
  datos = toSignal(this.bonos.obtenerLocales().pipe(catchError(() => of(null))));

  soloVigentes = signal(true);

  filas = computed(() => {
    const d = this.datos();
    if (!d) return [];
    if (!this.soloVigentes()) return d;
    const hoy = this.hoyIso();
    return d.filter((b) => b.status === 'vigente' && b.fecha_vencimiento >= hoy);
  });

  /** Fecha local de hoy en formato AAAA-MM-DD, igual que las fechas que manda la API */
  private hoyIso(): string {
    const f = new Date();
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const dia = String(f.getDate()).padStart(2, '0');
    return `${f.getFullYear()}-${mes}-${dia}`;
  }

  private formatoNumero = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });

  numero(v: number | null): string {
    return v === null ? '—' : this.formatoNumero.format(v);
  }

  unidadMonto(b: BonoLocalApi): string {
    return b.unidad === 'uf' ? 'miles de UF' : 'millones CLP';
  }

  fecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}-${mes}-${anio}`;
  }

  alternarVigentes(evento: Event): void {
    this.soloVigentes.set((evento.target as HTMLInputElement).checked);
  }
}