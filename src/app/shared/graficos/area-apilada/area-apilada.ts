import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import { ThemeService } from '../../../core/services/theme';

export interface SerieGrafico {
  nombre: string;
  datos: (number | null)[];
  color?: string;
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
  /** null = comportamiento anterior (eje sin decimales, tooltip hasta 1 decimal) */
  readonly decimales = input<number | null>(null);
  readonly unidadY = input<string>('');

  private readonly tema = inject(ThemeService);

  // En modo porcentaje, cada valor pasa a ser su % del total de esa categoría
  private readonly seriesMostradas = computed<SerieGrafico[]>(() => {
    const series = this.series();
    if (this.modo() === 'absoluto') {
      return series;
    }
    const totales = this.categorias().map((_, i) =>
      series.reduce((suma, s) => suma + (s.datos[i] ?? 0), 0),
    );
    return series.map((s) => ({
      ...s,
      datos: s.datos.map((valor, i) =>
        valor === null ? null : totales[i] > 0 ? (valor / totales[i]) * 100 : 0,
      ),
    }));
  });

  readonly opciones = computed<EChartsCoreOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e8e8e8' : '#1a1a1a';
    const colorLinea = oscuro ? '#333333' : '#e0e0e0';

    const decimales = this.decimales();
    const unidad = this.unidadY();
    const formatoTooltip = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: decimales ?? 0,
      maximumFractionDigits: decimales ?? 1,
    });
    const formatoEje = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: decimales ?? 0,
      maximumFractionDigits: decimales ?? 0,
    });
    const esVacio = (v: unknown) => v === null || v === undefined || Number.isNaN(Number(v));

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
          esVacio(valor) ? '—' : `${formatoTooltip.format(Number(valor))}${unidad}`,
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
          formatter: (valor: unknown) => `${formatoEje.format(Number(valor))}${unidad}`,
        },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: this.seriesMostradas().map((s) => ({
        name: s.nombre,
        type: 'line',
        stack: 'total',
        areaStyle: s.color ? { color: s.color } : {},
        itemStyle: s.color ? { color: s.color } : undefined,
        lineStyle: s.color ? { color: s.color } : undefined,
        showSymbol: false,
        data: s.datos,
      })),
    };
  });
}