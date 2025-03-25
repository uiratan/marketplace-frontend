import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MinhaNovaPaginaComponent } from './minha-nova-pagina/minha-nova-pagina.component';
import { HomeComponent } from './home/home.component';
import { authenticateGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Layout para rotas autenticadas
    canActivate: [authenticateGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'usuarios', component: ListaUsuariosComponent },
      { path: 'minha-nova-pagina', component: MinhaNovaPaginaComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotfoundComponent }
];

      // { path: 'address', component: AddressComponent },
      // { path: 'teste', component: TesteComponent },
      // { path: 'produtos', component: ProdutosListaComponent },
      // { path: 'dashboard', component: DashboardComponent },
      // { path: '**', component: NotfoundComponent },


  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  // { path: 'minha-nova-pagina', component: MinhaNovaPaginaComponent },

  // {
  //   path: 'minha-nova-pagina',
  //   loadComponent: () => import('./minha-nova-pagina/minha-nova-pagina.component').then(m => m.MinhaNovaPaginaComponent)
  // }
