import { Injectable, signal } from '@angular/core';

const CLAVE_STORAGE = 'tema';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly esOscuro = signal<boolean>(this.leerTemaGuardado());

  constructor() {
    this.aplicarTema(this.esOscuro());
  }

  alternar(): void {
    const nuevoValor = !this.esOscuro();
    this.esOscuro.set(nuevoValor);
    this.aplicarTema(nuevoValor);
    localStorage.setItem(CLAVE_STORAGE, nuevoValor ? 'oscuro' : 'claro');
  }

  private leerTemaGuardado(): boolean {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) {
      return guardado === 'oscuro';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private aplicarTema(oscuro: boolean): void {
    document.documentElement.classList.toggle('dark-theme', oscuro);
  }
}