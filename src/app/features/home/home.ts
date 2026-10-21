import { Component } from '@angular/core';
import { GraficoEvolucion } from './grafico-evolucion/grafico-evolucion';
import { ResumenGeneral } from './resumen-general/resumen-general';
import { Financiamiento } from './financiamiento/financiamiento';

@Component({
  imports: [GraficoEvolucion, ResumenGeneral, Financiamiento],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
