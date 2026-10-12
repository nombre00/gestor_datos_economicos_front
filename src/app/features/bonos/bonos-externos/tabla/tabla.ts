import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../../core/services/bonos';

@Component({
  selector: 'app-bonos-externos-tabla',
  standalone: true,
  imports: [],
  templateUrl: './tabla.html',
  styleUrl: './tabla.scss',
})
export class Tabla {
  private bonos = inject(BonosService);
  datos = toSignal(this.bonos.obtenerExternos().pipe(catchError(() => of(null))));

  soloVigentes = signal(true);

  filas = computed(() => {
    const d = this.datos();
    if (!d) return [];
    return this.soloVigentes() ? d.filter((b) => b.vigencia === 'vigente') : d;
  });

  private formatoNumero = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });

  numero(v: number | null): string {
    return v === null ? '—' : this.formatoNumero.format(v);
  }

  fecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}-${mes}-${anio}`;
  }

  alternarVigentes(evento: Event): void {
    this.soloVigentes.set((evento.target as HTMLInputElement).checked);
  }
}