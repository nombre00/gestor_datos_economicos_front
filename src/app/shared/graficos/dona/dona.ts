import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

import { ThemeService } from '../../../core/services/theme';

export interface DatoDona {
  nombre: string;
  valor: number;
  color?: string;
}

@Component({
  selector: 'app-dona',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './dona.html',
  styleUrl: './dona.scss',
})
export class Dona {
  private tema = inject(ThemeService);

  datos = input.required<DatoDona[]>();
  titulo = input('');
  unidad = input('');

  private formato = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
  private formatoPct = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  opciones = computed<EChartsOption>(() => {
    const oscuro = this.tema.esOscuro();
    const colorTexto = oscuro ? '#e5e7eb' : '#1f2937';
    const unidad = this.unidad();

    return {
      backgroundColor: 'transparent',
      title: { text: this.titulo(), left: 'center', textStyle: { color: colorTexto } },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const p = Array.isArray(params) ? params[0] : params;
          return `<b>${p.name}</b><br>${this.formato.format(p.value as number)} ${unidad}`
            + `<br>${this.formatoPct.format(p.percent ?? 0)}%`;
        },
      },
      legend: { bottom: 0, icon: 'circle', textStyle: { color: colorTexto } },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '50%'],
          label: {
            color: colorTexto,
            formatter: (p) => `${p.name}\n${this.formatoPct.format(p.percent ?? 0)}%`,
          },
          data: this.datos().map((d) => ({
            name: d.nombre,
            value: d.valor,
            itemStyle: d.color ? { color: d.color } : undefined,
          })),
        },
      ],
    };
  });
}