/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {APP_BASE_HREF} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './@core/core.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ThemeModule} from './@theme/theme.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DashboardService} from "./service/dashboard-service";
import {TestPipe} from "./test.pipe";
import {BlockUIModule} from "ng-block-ui";
import {SocketService} from "./service/socket-service";
import { ModalModule } from 'ngx-bootstrap';
import {ToastrModule} from "ngx-toastr";

@NgModule({
  declarations: [AppComponent, TestPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    BlockUIModule.forRoot({
      message: 'Loading...'
    }),
    ModalModule.forRoot(),
    ToastrModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    DashboardService,
    SocketService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ]
})
export class AppModule {
}
