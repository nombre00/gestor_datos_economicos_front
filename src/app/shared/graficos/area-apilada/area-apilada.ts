import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import { ThemeService } from '../../../core/services/theme';

export interface SerieGrafico {
  nombre: string;
  datos: number[];
}

@Component({
  selector: 'app-area-apilada',
  imports: [NgxEchartsDirective],
  templateUrl: './area-apilada.html',
  styleUrl: './area-apilada.scss',
})
export class AreaApilada {
  readonly categorias = input.required<string[]>();
  readonly series = input.required<SerieGrafico[]>();
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
      title: { text: this.titulo(), textStyle: { color: colorTexto } },
      tooltip: { trigger: 'axis' },
      legend: { top: 30, textStyle: { color: colorTexto } },
      grid: { left: 60, right: 20, top: 80, bottom: 40 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.categorias(),
        axisLine: { lineStyle: { color: colorLinea } },
      },
      yAxis: {
        type: 'value',
        name: this.etiquetaY(),
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: this.series().map((s) => ({
        name: s.nombre,
        type: 'line',
        stack: 'total',
        areaStyle: {},
        showSymbol: false,
        data: s.datos,
      })),
    };
  });
}