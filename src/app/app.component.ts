/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import {ViewChild} from "@angular/core";
import {ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'ngx-app',
  template: ' <block-ui><router-outlet></router-outlet> </block-ui><div toastContainer></div>',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  constructor(private analytics: AnalyticsService,private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.toastrService.overlayContainer = this.toastContainer;
  }
}
