import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../../service/dashboard-service';

import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {NgZone} from '@angular/core';
import * as moment from 'moment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import * as $ from 'jquery';
import {ElementRef} from "@angular/core";
import {SocketService} from "../../../service/socket-service";
import {ToastrService} from "ngx-toastr";
import {ConfirmationModalComponent} from "../confirm/confirmation-modal.component";

import {BsModalService} from 'ngx-bootstrap/modal';


@Component({
  selector: 'ngx-monitors',
  styleUrls: ['./monitors.component.scss'],
  templateUrl: './monitors.component.html',
})
export class MonitorsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('editModal') editModal: ElementRef;
  monitors: any[] = [];
  selected: any;
  modes: any[];
  showModal = false;
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
  toDelete: any;

  constructor(private dashboardService: DashboardService,
              private zone: NgZone,
              private socketService: SocketService,
              private toastrService: ToastrService,
              private modalService: BsModalService) {

  }

  ngOnInit() {
    this.dashboardService.getAllMonitors().subscribe((res: any) => {
      if (res.msg) {


        this.socketService.connectToShinobi();
        setTimeout(() => {
          this.getAllMonitors();
        }, 2000);

        // this.socketService.getShinobiAuth().subscribe((res: any) => {
        //
        // })
      } else {
        res.forEach((m: any) => {
          m.detailsObj = JSON.parse(m.details);
        })
        this.monitors = res;
      }

    })
  }

  getAllMonitors() {
    this.dashboardService.getAllMonitors().subscribe((res: any) => {
      res.forEach((m: any) => {
        m.detailsObj = JSON.parse(m.details);
      })
      this.monitors = res;
    });
  }

  edit(monitor: any) {
    this.selected = Object.assign({}, monitor);
  }

  tryDelete(monitor: any) {
    this.toDelete = monitor;
    this.showConfirmationModal('Delete monitor ' + monitor.name, 'Are you sure?');
  }


  onNewClose(isSaved: any) {
    if (isSaved) {
      this.getAllMonitors();
      this.toastrService.success('Monitor saved successfully', 'Success!');
    } else {
      this.toastrService.error('There was a problem. Please try later!', 'Error!');
    }

  }

  onUpdateClose(isSaved: any) {
    if (isSaved) {
      this.getAllMonitors();
      this.toastrService.success('Monitor saved successfully', 'Success!');
    } else {
      this.toastrService.error('There was a problem. Please try later!', 'Error!');
    }

  }

  create() {
    this.new_monitor.mid = this.guid();
    this.dashboardService.createMonitor(this.new_monitor).subscribe((res: any) => {

    });
  }

  public showConfirmationModal(title: string, body: string): void {
    const modal = this.modalService.show(ConfirmationModalComponent);
    (<ConfirmationModalComponent>modal.content).showConfirmationModal(
      title,
      body
    );

    (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.dashboardService.deteleMonitor(this.toDelete).subscribe((res) => {
          if (res) {
            this.getAllMonitors();
            this.toastrService.success('Monitor deleted successfully', 'Success!');
          } else {
            this.toastrService.error('There was a problem. Please try later!', 'Error!');
          }
        })
      } else if (result === false) {

      } else {
        // When closing the modal without no or yes
      }
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
}


