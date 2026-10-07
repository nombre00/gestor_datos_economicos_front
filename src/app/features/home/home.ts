import { Component } from '@angular/core';
import { GraficoEvolucion } from './grafico-evolucion/grafico-evolucion';

@Component({
  imports: [GraficoEvolucion],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
