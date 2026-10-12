import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { ThemeService } from '../../../core/services/theme';

export interface PuntoDispersion {
  x: number;
  y: number;
  color: number;
  etiqueta: string;
}

@Component({
  selector: 'app-dispersion',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './dispersion.html',
  styleUrl: './dispersion.scss',
})
export class Dispersion {
  private tema = inject(ThemeService);

  puntos = input.required<PuntoDispersion[]>();
  titulo = input('');
  etiquetaX = input('');
  etiquetaY = input('');
  etiquetaColor = input('');

  private formato = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 });

  opciones = computed<EChartsOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e5e7eb' : '#1f2937';
    const colorLinea = oscuro ? '#374151' : '#e5e7eb';

    const puntos = this.puntos();
    const valoresColor = puntos.map((p) => p.color);
    const min = valoresColor.length ? Math.min(...valoresColor) : 0;
    const max = valoresColor.length ? Math.max(...valoresColor) : 1;

    const etiquetaX = this.etiquetaX();
    const etiquetaY = this.etiquetaY();
    const etiquetaColor = this.etiquetaColor();

    return {
      backgroundColor: 'transparent',
      title: { text: this.titulo(), left: 'center', textStyle: { color: colorTexto } },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const punto = Array.isArray(params) ? params[0] : params;
          const [x, y, c, etiqueta] = punto.value as [number, number, number, string];
          return `<b>${etiqueta}</b><br>${etiquetaX}: ${this.formato.format(x)}<br>`
            + `${etiquetaY}: ${this.formato.format(y)}<br>${etiquetaColor}: ${c}`;
        },
      },
      visualMap: {
        type: 'continuous',
        dimension: 2,
        min,
        max,
        precision: 0,
        calculable: true,
        orient: 'vertical',
        right: 10,
        top: 'middle',
        text: [etiquetaColor, ''],
        textStyle: { color: colorTexto },
        inRange: { color: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'] },
      },
      grid: { left: 90, right: 120, top: 60, bottom: 70 },
      xAxis: {
        type: 'value',
        name: etiquetaX,
        nameLocation: 'middle',
        nameGap: 35,
        nameTextStyle: { color: colorTexto },
        axisLabel: { color: colorTexto },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      yAxis: {
        type: 'value',
        name: etiquetaY,
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: { color: colorTexto },
        axisLabel: { color: colorTexto },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 13,
          data: puntos.map((p) => [p.x, p.y, p.color, p.etiqueta]),
        },
      ],
    };
  });
}