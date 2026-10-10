import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import { ThemeService } from '../../../core/services/theme';

export interface SerieLineas {
  nombre: string;
  datos: (number | null)[];
}

@Component({
  selector: 'app-lineas',
  imports: [NgxEchartsDirective],
  templateUrl: './lineas.html',
  styleUrl: './lineas.scss',
})
export class Lineas {
  readonly categorias = input.required<string[]>();
  readonly series = input.required<SerieLineas[]>();
  readonly titulo = input<string>('');
  readonly etiquetaY = input<string>('');

  private readonly tema = inject(ThemeService);

  readonly opciones = computed<EChartsCoreOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e8e8e8' : '#1a1a1a';
    const colorLinea = oscuro ? '#333333' : '#e0e0e0';

    return {
      backgroundColor: 'transparent',
      textStyle: { color: colorTexto },
      title: {
        text: this.titulo(),
        left: 'center',
        textStyle: { color: colorTexto },
      },
      tooltip: { trigger: 'axis' },
      legend: {
        bottom: 0,
        icon: 'roundRect',
        textStyle: { color: colorTexto },
      },
      grid: { left: 90, right: 20, top: 60, bottom: 70 },
      xAxis: {
        type: 'category',
        data: this.categorias(),
        axisLine: { lineStyle: { color: colorLinea } },
      },
      yAxis: {
        type: 'value',
        name: this.etiquetaY(),
        nameLocation: 'middle',
        nameGap: 65,
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: this.series().map((s) => ({
        name: s.nombre,
        type: 'line',
        showSymbol: false,
        data: s.datos,
      })),
    };
  });
}