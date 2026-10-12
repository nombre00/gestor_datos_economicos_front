import { Component } from '@angular/core';

import { GraficoSpread } from './grafico-spread/grafico-spread';
import { GraficoVencimientos } from './grafico-vencimientos/grafico-vencimientos';
import { Tabla } from './tabla/tabla';

@Component({
  selector: 'app-bonos-externos',
  standalone: true,
  imports: [GraficoVencimientos, GraficoSpread, Tabla],
  templateUrl: './bonos-externos.html',
  styleUrl: './bonos-externos.scss',
})
export class BonosExternos {}