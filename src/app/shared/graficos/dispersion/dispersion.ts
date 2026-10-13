import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { ThemeService } from '../../../core/services/theme';

export interface PuntoDispersion {
  x: number;
  y: number;
  color: number;
  etiqueta: string;
  grupo?: string;
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

  private formato = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });

  opciones = computed<EChartsOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e5e7eb' : '#1f2937';
    const colorLinea = oscuro ? '#374151' : '#e5e7eb';

    const puntos = this.puntos();
    const porGrupos = puntos.some((p) => p.grupo !== undefined);

    const etiquetaX = this.etiquetaX();
    const etiquetaY = this.etiquetaY();
    const etiquetaColor = this.etiquetaColor();

    const aFila = (p: PuntoDispersion) => [p.x, p.y, p.color, p.etiqueta, p.grupo ?? ''];

    const base: EChartsOption = {
      backgroundColor: 'transparent',
      title: { text: this.titulo(), left: 'center', textStyle: { color: colorTexto } },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const punto = Array.isArray(params) ? params[0] : params;
          const [x, y, c, etiqueta, grupo] =
            punto.value as [number, number, number, string, string];
          const tercero = grupo ? grupo : String(c);
          return `<b>${etiqueta}</b><br>${etiquetaX}: ${this.formato.format(x)}<br>`
            + `${etiquetaY}: ${this.formato.format(y)}<br>${etiquetaColor}: ${tercero}`;
        },
      },
      grid: { left: 90, right: porGrupos ? 30 : 120, top: 60, bottom: porGrupos ? 90 : 70 },
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
    };

    if (porGrupos) {
      const grupos = [...new Set(puntos.map((p) => p.grupo as string))];
      return {
        ...base,
        legend: { bottom: 0, icon: 'circle', textStyle: { color: colorTexto } },
        series: grupos.map((g) => ({
          name: g,
          type: 'scatter' as const,
          symbolSize: 13,
          data: puntos.filter((p) => p.grupo === g).map(aFila),
        })),
      };
    }

    const valoresColor = puntos.map((p) => p.color);
    const min = valoresColor.length ? Math.min(...valoresColor) : 0;
    const max = valoresColor.length ? Math.max(...valoresColor) : 1;

    return {
      ...base,
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
      series: [
        {
          type: 'scatter' as const,
          symbolSize: 13,
          data: puntos.map(aFila),
        },
      ],
    };
  });
}