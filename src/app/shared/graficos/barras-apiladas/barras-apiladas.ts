import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { ThemeService } from '../../../core/services/theme';

export interface SerieBarras {
  nombre: string;
  datos: (number | null)[];
}

@Component({
  selector: 'app-barras-apiladas',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './barras-apiladas.html',
  styleUrl: './barras-apiladas.scss',
})
export class BarrasApiladas {
  private tema = inject(ThemeService);

  categorias = input.required<string[]>();
  series = input.required<SerieBarras[]>();
  titulo = input('');
  etiquetaY = input('');
  apilar = input(true);

  private formato = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

  opciones = computed<EChartsOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e5e7eb' : '#1f2937';
    const colorLinea = oscuro ? '#374151' : '#e5e7eb';

    return {
      backgroundColor: 'transparent',
      title: { text: this.titulo(), left: 'center', textStyle: { color: colorTexto } },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (v) => (typeof v === 'number' ? this.formato.format(v) : '—'),
      },
      legend: { bottom: 0, icon: 'roundRect', textStyle: { color: colorTexto } },
      grid: { left: 90, right: 30, top: 60, bottom: 110 },
      xAxis: {
        type: 'category',
        data: this.categorias(),
        axisLabel: { color: colorTexto, rotate: 45 },
      },
      yAxis: {
        type: 'value',
        name: this.etiquetaY(),
        nameLocation: 'middle',
        nameGap: 70,
        nameTextStyle: { color: colorTexto },
        axisLabel: { color: colorTexto, formatter: (v: number) => this.formato.format(v) },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: this.series().map((s) => ({
        name: s.nombre,
        type: 'bar' as const,
        stack: this.apilar() ? 'total' : undefined,
        data: s.datos,
        emphasis: { focus: 'series' as const },
      })),
    };
  });
}