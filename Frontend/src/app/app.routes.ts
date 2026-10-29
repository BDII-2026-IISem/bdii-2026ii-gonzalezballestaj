
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Home },
  { path: 'admin', component: Admin },
  { path: 'destinos', loadChildren: () => import('./components/destination/destination.routes').then(m => m.DESTINATION_ROUTES) },
  { path: 'login', component: Login },
  { path: 'alojamientos', loadChildren: () => import('./components/accommodation/accommodation.routes').then(m => m.ACCOMMODATION_ROUTES) },
  { path: 'clientes', loadChildren: () => import('./components/client/client/user.routes').then(m => m.USER_ROUTES) },
  { path: 'usuarios', loadChildren: () => import('./components/client/client/user.routes').then(m => m.USER_ROUTES) },
  { path: 'viajeros', loadChildren: () => import('./components/client/traveler/traveler.routes').then(m => m.TRAVELER_ROUTES) },
  { path: 'paquetes', loadChildren: () => import('./components/product/package/package.routes').then(m => m.PACKAGE_ROUTES) },
  { path: 'salidas', loadChildren: () => import('./components/product/departure/departure.routes').then(m => m.DEPARTURE_ROUTES) },
  { path: 'proveedores', loadChildren: () => import('./components/product/suppliers/suppliers.routes').then(m => m.SUPPLIERS_ROUTES) },
  { path: 'reservas', loadChildren: () => import('./components/sale/booking/reservation.routes').then(m => m.RESERVATION_ROUTES) },
  { path: 'pagos', loadChildren: () => import('./components/sale/payment/payment.routes').then(m => m.PAYMENT_ROUTES) },
  { path: 'cancelaciones', loadChildren: () => import('./components/sale/cancellations/cancellations.routes').then(m => m.CANCELLATIONS_ROUTES) },
  { path: 'vouchers', loadChildren: () => import('./components/sale/voucher/voucher.routes').then(m => m.VOUCHER_ROUTES) },
  { path: 'servicios', loadChildren: () => import('./service/service.routes').then(m => m.SERVICE_ROUTES) },
  { path: '**', redirectTo: 'inicio' }
];
