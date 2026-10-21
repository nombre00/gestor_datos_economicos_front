import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import { ThemeService } from '../../../core/services/theme';

export interface SerieLineas {
  nombre: string;
  datos: (number | null)[];
  color?: string;
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
  /** null = formato por defecto de ECharts (comportamiento anterior) */
  readonly decimales = input<number | null>(null);
  readonly unidadY = input<string>('');

  private readonly tema = inject(ThemeService);

  readonly opciones = computed<EChartsCoreOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e8e8e8' : '#1a1a1a';
    const colorLinea = oscuro ? '#333333' : '#e0e0e0';

    const decimales = this.decimales();
    const unidad = this.unidadY();
    const conFormato = decimales !== null || unidad !== '';
    const formato = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: decimales ?? 0,
      maximumFractionDigits: decimales ?? 2,
    });
    const formatear = (v: unknown) =>
      v === null || v === undefined || Number.isNaN(Number(v)) ? '—' : `${formato.format(Number(v))}${unidad}`;

    return {
      backgroundColor: 'transparent',
      textStyle: { color: colorTexto },
      title: {
        text: this.titulo(),
        left: 'center',
        textStyle: { color: colorTexto },
      },
      tooltip: conFormato ? { trigger: 'axis', valueFormatter: formatear } : { trigger: 'axis' },
      legend: {
        bottom: 0,
        icon: 'roundRect',
        textStyle: { color: colorTexto },
      },
      // right 30 = mismo margen que barras-apiladas, para alinear años entre gráficos
      grid: { left: 90, right: 30, top: 60, bottom: 70 },
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
        axisLabel: conFormato ? { formatter: formatear } : undefined,
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: this.series().map((s) => ({
        name: s.nombre,
        type: 'line',
        showSymbol: false,
        data: s.datos,
        itemStyle: s.color ? { color: s.color } : undefined,
        lineStyle: s.color ? { color: s.color } : undefined,
      })),
    };
  });
}