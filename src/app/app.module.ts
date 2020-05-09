//import { BrowserModule } from '@angular/platform-browser';

import { BrowserModule, Title }  from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//components
import { AppComponent } from './app.component';
import { PlatformCheckComponent } from './platform-check/platform-check.component';
import { PlatformDetailsComponent } from './platform-details/platform-details.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';
import { AppRoutingModule } from './app-routing.module';

//services
import { PlatformService } from './services/platform.service';
import { IdolRequestService } from './services/request.service';


@NgModule({
  declarations: [
    AppComponent,
    PlatformCheckComponent,
    PlatformDetailsComponent,
    AboutComponent,
    SearchComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
    
  ],
  providers: [IdolRequestService, PlatformService, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
