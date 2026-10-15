import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { ThemeService } from '../../../core/services/theme';

export interface SerieBurbujas {
  nombre: string;
  datos: (number | null)[];
  tamanos: number[];
  color?: string;
  /** Texto HTML opcional por categoría, se agrega al final del tooltip */
  detalle?: string[];
}

@Component({
  selector: 'app-burbujas',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './burbujas.html',
  styleUrl: './burbujas.scss',
})
export class Burbujas {
  private tema = inject(ThemeService);

  categorias = input.required<string[]>();
  series = input.required<SerieBurbujas[]>();
  titulo = input('');
  subtitulo = input('');
  etiquetaY = input('');
  unidadY = input('');
  etiquetaTamano = input('');

  private formatoY = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  private formatoTamano = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

  opciones = computed<EChartsOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e5e7eb' : '#1f2937';
    const colorSecundario = oscuro ? '#9ca3af' : '#6b7280';
    const colorLinea = oscuro ? '#374151' : '#e5e7eb';

    const categorias = this.categorias();
    const series = this.series();
    const unidadY = this.unidadY();
    const etiquetaTamano = this.etiquetaTamano();

    const maxTamano = Math.max(1, ...series.flatMap((s) => s.tamanos));
    const TAMANO_MIN = 6;
    const TAMANO_MAX = 40;

    return {
      backgroundColor: 'transparent',
      title: {
        text: this.titulo(),
        subtext: this.subtitulo(),
        left: 'center',
        textStyle: { color: colorTexto },
        subtextStyle: { color: colorSecundario },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const p = Array.isArray(params) ? params[0] : params;
          const [anio, y, tamano, detalle] = p.value as [string, number, number, string];
          return `<b>${p.seriesName}</b> · ${anio}<br>`
            + `${this.formatoY.format(y)}${unidadY}<br>`
            + `${etiquetaTamano}: ${this.formatoTamano.format(tamano)}`
            + (detalle ? `<br><br>${detalle}` : '');
        },
      },
      legend: { bottom: 0, icon: 'circle', textStyle: { color: colorTexto } },
      // Mismos márgenes laterales que barras-apiladas para que los años queden alineados
      grid: { left: 90, right: 30, top: this.subtitulo() ? 80 : 60, bottom: 110 },
      xAxis: {
        type: 'category',
        data: categorias,
        axisLabel: { color: colorTexto, rotate: 45 },
      },
      yAxis: {
        type: 'value',
        name: this.etiquetaY(),
        nameLocation: 'middle',
        nameGap: 70,
        nameTextStyle: { color: colorTexto },
        axisLabel: { color: colorTexto, formatter: (v: number) => `${this.formatoY.format(v)}${unidadY}` },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: series.map((s) => ({
        name: s.nombre,
        type: 'scatter' as const,
        itemStyle: { color: s.color, opacity: 0.8 },
        symbolSize: (valor: unknown) => {
          const tamano = (valor as [string, number, number, string])[2];
          return TAMANO_MIN + (TAMANO_MAX - TAMANO_MIN) * Math.sqrt(tamano / maxTamano);
        },
        data: categorias
          .map((c, i) =>
            s.datos[i] === null ? null : [c, s.datos[i], s.tamanos[i], s.detalle?.[i] ?? ''],
          )
          .filter((punto): punto is [string, number, number, string] => punto !== null),
      })),
    };
  });
}