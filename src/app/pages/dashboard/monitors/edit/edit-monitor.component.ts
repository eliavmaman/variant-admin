import {Component, OnInit, ViewChild} from '@angular/core';
import {NgZone} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {ViewEncapsulation} from "@angular/core";
import {DashboardService} from '../../../../service/dashboard-service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ModalDirective} from "ngx-bootstrap";
import {Input} from "@angular/core";

@Component({
  selector: 'edit-monitor-modal',
  templateUrl: './edit-monitor.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EditMonitorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('childModal') modal: ModalDirective;
  @Output() onClose = new EventEmitter<any>();
  @Input() selected: any;
  modes: any[];

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

  update() {

    this.dashboardService.updateMonitor(this.selected).subscribe((res: any) => {
        this.hide();
        if (res.ok) {
          this.onClose.emit(true);
        }
        else {
          this.onClose.emit(false);
        }

      }, (err) => {
        this.onClose.emit(false);
      }
    )
    ;
  }

  ngAfterViewInit() {

  }

  show(): void {
    this.modal.show();
  }

  hide(): void {
    this.modal.hide();
  }
}


