import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlatformCheckComponent } from './platform-check/platform-check.component';
import { PlatformDetailsComponent } from './platform-details/platform-details.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
    
  { path: 'check', component: PlatformCheckComponent },
  { path: '', redirectTo: '/check', pathMatch: 'full' },
  { path: 'details/:environment', component: PlatformDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'search', component: SearchComponent},
  { path: 'search/:environment/:instance', component: SearchComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ], //, { enableTracing: true}
  exports: [ RouterModule ]
})
export class AppRoutingModule {}