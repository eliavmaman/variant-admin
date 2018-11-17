import {Component, OnInit, ViewChild} from '@angular/core';
import {NgZone} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {ViewEncapsulation} from "@angular/core";
import {DashboardService} from '../../../../service/dashboard-service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'create-monitor-modal',
  templateUrl: './create-monitor.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CreateMonitorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('childModal') modal: ModalDirective;
  @Output() onClose = new EventEmitter<any>();
  modes: any[];
  new_monitor: any = {
    mode: 'record',
    mid: '',
    name: '',
    type: 'mp4',
    protocol: 'https',
    host: 'cdn.shinobi.video',
    port: 443,
    path: '',
    ext: 'mp4',
    fps: '1',
    width: '640',
    height: '480',
    details: {}
  };

  constructor(private dashboardService: DashboardService, private zone: NgZone) {
    this.modes = [
      {id: 'stop', name: 'Disabled'},
      {id: 'idle', name: 'Idle'},
      {id: 'start', name: 'Watch Only'},
      {id: 'record', name: 'Record'}
    ]
  }

  ngOnInit() {

  }

  create() {
    this.new_monitor.mid = this.guid();
    this.dashboardService.createMonitor(this.new_monitor).subscribe((res: any) => {
      this.hide();
      this.onClose.emit(true);
    });
  }

  ngAfterViewInit() {

  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }


  show(): void {
    this.modal.show();
  }

  hide(): void {
    this.modal.hide();
  }
}


