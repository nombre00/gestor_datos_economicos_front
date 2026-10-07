import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Home } from './features/home/home';
import { PorMoneda } from './features/composicion/por-moneda/por-moneda';
import { PorAcreedor } from './features/composicion/por-acreedor/por-acreedor';
import { Gobierno } from './features/tenedores/gobierno/gobierno';
import { Plazo } from './features/tenedores/plazo/plazo';
import { BonosExternos } from './features/bonos/bonos-externos/bonos-externos';
import { BonosLocales } from './features/bonos/bonos-locales/bonos-locales';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'composicion/moneda', component: PorMoneda },
      { path: 'composicion/acreedor', component: PorAcreedor },
      { path: 'tenedores/gobierno', component: Gobierno },
      { path: 'tenedores/plazo', component: Plazo },
      { path: 'bonos/externos', component: BonosExternos },
      { path: 'bonos/locales', component: BonosLocales },
    ],
  },
];