import { Component, computed, input, signal } from '@angular/core';

export interface SerieTabla {
  nombre: string;
  datos: (number | null)[];
}

@Component({
  selector: 'app-tabla-datos',
  standalone: true,
  imports: [],
  templateUrl: './tabla-datos.html',
  styleUrl: './tabla-datos.scss',
})
export class TablaDatos {
  categorias = input.required<string[]>();
  series = input.required<SerieTabla[]>();
  titulo = input('Datos');
  etiquetaCategoria = input('Año');
  unidad = input('');
  mostrarTotal = input(false);
  nombreArchivo = input('datos');
  decimales = input(0);

  abierta = signal(false);

  filas = computed(() => {
    const series = this.series();
    return this.categorias().map((categoria, i) => {
      const valores = series.map((s) => s.datos[i] ?? null);
      const conDato = valores.filter((v): v is number => v !== null);
      return {
        categoria,
        valores,
        total: conDato.length ? conDato.reduce((a, b) => a + b, 0) : null,
      };
    });
  });

  private formato = computed(
    () => new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: this.decimales(),
      maximumFractionDigits: this.decimales(),
    }),
  );

  numero(v: number | null): string {
    return v === null ? '—' : this.formato().format(v);
  }

  alternar(): void {
    this.abierta.update((v) => !v);
  }

  /** CSV con ";" como separador y coma decimal, que es como lo abre Excel en Chile.
   *  Los valores van con precisión completa (sin redondear como en pantalla). */
  descargarCsv(): void {
    const unidad = this.unidad() ? ` (${this.unidad()})` : '';
    const aTexto = (v: number | null) => (v === null ? '' : String(v).replace('.', ','));
    const escapar = (t: string) => (/[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t);

    const encabezado = [
      this.etiquetaCategoria(),
      ...this.series().map((s) => s.nombre + unidad),
      ...(this.mostrarTotal() ? [`Total${unidad}`] : []),
    ];
    const lineas = this.filas().map((f) => [
      f.categoria,
      ...f.valores.map(aTexto),
      ...(this.mostrarTotal() ? [aTexto(f.total)] : []),
    ]);

    const contenido = [encabezado, ...lineas]
      .map((linea) => linea.map(escapar).join(';'))
      .join('\r\n');

    // El \uFEFF (BOM) hace que Excel reconozca las tildes
    const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `${this.nombreArchivo()}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
  }
}