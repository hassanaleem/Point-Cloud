import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/viewer/viewer.component').then(c => c.ViewerComponent)
    }, 
    {
        path: 'table',
        loadComponent: () => import('./components/table/table.component').then(c => c.TableComponent)
    }
];
