import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path: '', 'title': 'SCX | Home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: 'frete-maritimo', 'title': 'SCX | Frete Marítimo',
        loadComponent: () => import('./pages/frete-maritimo/frete-maritimo.component').then((m) => m.FreteMaritimoComponent),
    },
    {
        path: 'frete-aereo', 'title': 'SCX | Frete Aéreo',
        loadComponent: () => import('./pages/frete-aereo/frete-aereo.component').then((m) => m.FreteAereoComponent),
    },
    {
        path: 'desembaraco-aduaneiro', 'title': 'SCX | Desembaraço Aduaneiro',
        loadComponent: () => import('./pages/desembaraco/desembaraco.component').then((m) => m.DesembaracoComponent),
    },
    {
        path: 'transporte-rodoviario', 'title': 'SCX | Transporte Rodoviário',
        loadComponent: () => import('./pages/transporte-rodoviario/transporte-rodoviario.component').then((m) => m.TransporteRodoviarioComponent),
    },
    {
        path: 'seguro-carga', 'title': 'SCX | Seguro de Carga',
        loadComponent: () => import('./pages/seguro-carga/seguro-carga.component').then((m) => m.SeguroCargaComponent),
    },
    {
        path: 'contato', 'title': 'SCX | Contato',
        loadComponent: () => import('./pages/contato/contato.component').then((m) => m.ContatoComponent),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
