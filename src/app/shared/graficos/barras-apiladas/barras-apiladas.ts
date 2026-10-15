import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { ThemeService } from '../../../core/services/theme';

export interface SerieBarras {
  nombre: string;
  datos: (number | null)[];
  color?: string;
  /** Texto HTML opcional por categoría, se agrega al final del tooltip */
  detalle?: string[];
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
  subtitulo = input('');
  etiquetaY = input('');
  unidadY = input('');
  decimales = input(0);
  apilar = input(true);

  private formato = computed(
    () => new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: this.decimales(),
      maximumFractionDigits: this.decimales(),
    }),
  );

  opciones = computed<EChartsOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e5e7eb' : '#1f2937';
    const colorSecundario = oscuro ? '#9ca3af' : '#6b7280';
    const colorLinea = oscuro ? '#374151' : '#e5e7eb';

    const formato = this.formato();
    const unidad = this.unidadY();
    const series = this.series();
    const formatear = (v: unknown) =>
      typeof v === 'number' ? `${formato.format(v)}${unidad}` : '—';

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
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const lista = Array.isArray(params) ? params : [params];
          if (!lista.length) return '';
          const indice = lista[0].dataIndex;
          let html = `<b>${lista[0].name}</b>`;
          for (const p of lista) {
            html += `<br>${p.marker ?? ''}${p.seriesName}: ${formatear(p.value)}`;
          }
          const detalles = series
            .map((s) => s.detalle?.[indice])
            .filter((d): d is string => !!d);
          if (detalles.length) {
            html += `<br><br>${detalles.join('<br>')}`;
          }
          return html;
        },
      },
      legend: { bottom: 0, icon: 'roundRect', textStyle: { color: colorTexto } },
      grid: { left: 90, right: 30, top: this.subtitulo() ? 80 : 60, bottom: 110 },
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
        axisLabel: { color: colorTexto, formatter: (v: number) => `${formato.format(v)}${unidad}` },
        splitLine: { lineStyle: { color: colorLinea } },
      },
      series: series.map((s) => ({
        name: s.nombre,
        type: 'bar' as const,
        stack: this.apilar() ? 'total' : undefined,
        data: s.datos,
        itemStyle: s.color ? { color: s.color } : undefined,
        emphasis: { focus: 'series' as const },
      })),
    };
  });
}