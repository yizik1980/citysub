import { Routes } from '@angular/router';
import { layoutResolver } from './services/layout.resolver';

export const routes: Routes = [

    {
        pathMatch: 'full',
        path: '',
        resolve: {
            layout: layoutResolver
        },
        loadComponent: () => import('./components/layout/layout.component').then(c => c.LayoutComponent),
    }
];  
