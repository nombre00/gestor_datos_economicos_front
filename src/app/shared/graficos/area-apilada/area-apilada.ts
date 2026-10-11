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
  readonly modo = input<'absoluto' | 'porcentaje'>('absoluto');

  private readonly tema = inject(ThemeService);

  // En modo porcentaje, cada valor pasa a ser su % del total de esa categoría
  private readonly seriesMostradas = computed<SerieGrafico[]>(() => {
    const series = this.series();
    if (this.modo() === 'absoluto') {
      return series;
    }
    const totales = this.categorias().map((_, i) =>
      series.reduce((suma, s) => suma + s.datos[i], 0),
    );
    return series.map((s) => ({
      nombre: s.nombre,
      datos: s.datos.map((valor, i) => (totales[i] > 0 ? (valor / totales[i]) * 100 : 0)),
    }));
  });

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
      tooltip: {
        trigger: 'axis',
        valueFormatter: (valor: unknown) =>
          Number(valor).toLocaleString('es-CL', { maximumFractionDigits: 1 }),
      },
      legend: {
        bottom: 0,
        icon: 'roundRect',
        textStyle: { color: colorTexto },
      },
      grid: { left: 90, right: 20, top: 60, bottom: 110 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.categorias(),
        axisLine: { lineStyle: { color: colorLinea } },
      },
      yAxis: {
        type: 'value',
        name: this.etiquetaY(),
        nameLocation: 'middle',
        nameGap: 65,
        max: this.modo() === 'porcentaje' ? 100 : undefined,
        axisLabel: {
          formatter: (valor: unknown) => Number(valor).toLocaleString('es-CL'),
        },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: this.seriesMostradas().map((s) => ({
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