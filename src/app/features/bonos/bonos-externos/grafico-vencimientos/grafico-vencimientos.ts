import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BonosService } from '../../../../core/services/bonos';
import { BarrasApiladas } from '../../../../shared/graficos/barras-apiladas/barras-apiladas';

@Component({
  selector: 'app-bonos-externos-grafico-vencimientos',
  standalone: true,
  imports: [BarrasApiladas],
  templateUrl: './grafico-vencimientos.html',
  styleUrl: './grafico-vencimientos.scss',
})
export class GraficoVencimientos {
  private bonos = inject(BonosService);
  datos = toSignal(this.bonos.obtenerVencimientosExternos().pipe(catchError(() => of(null))));
}