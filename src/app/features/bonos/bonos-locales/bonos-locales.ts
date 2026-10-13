import { Component } from '@angular/core';

import { GraficoTasaPlazo } from './grafico-tasa-plazo/grafico-tasa-plazo';
import { GraficoVencimientos } from './grafico-vencimientos/grafico-vencimientos';
import { Tabla } from './tabla/tabla';

@Component({
  selector: 'app-bonos-locales',
  standalone: true,
  imports: [GraficoVencimientos, GraficoTasaPlazo, Tabla],
  templateUrl: './bonos-locales.html',
  styleUrl: './bonos-locales.scss',
})
export class BonosLocales {}