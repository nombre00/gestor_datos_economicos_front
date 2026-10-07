import { Component } from '@angular/core';
import { AreaApilada, SerieGrafico } from '../../../shared/graficos/area-apilada/area-apilada';

@Component({
  selector: 'app-grafico-evolucion',
  imports: [AreaApilada],
  templateUrl: './grafico-evolucion.html',
  styleUrl: './grafico-evolucion.scss',
})
export class GraficoEvolucion {
  // DATOS DE PRUEBA: no son datos reales, se reemplazan al conectar la API
  readonly categorias = ['2020', '2021', '2022', '2023', '2024'];
  readonly series: SerieGrafico[] = [
    { nombre: 'Serie A', datos: [90, 100, 113, 123, 128] },
    { nombre: 'Serie B', datos: [10, 12, 14, 15, 17] },
  ];
}