import {Component, OnInit, ViewChild} from '@angular/core';
import {NgZone} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {ViewEncapsulation} from "@angular/core";
import {DashboardService} from '../../../../service/dashboard-service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ModalDirective} from "ngx-bootstrap";
import {ToastrService} from "ngx-toastr";

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
    details: {stream_type:''}
  };

  constructor(private dashboardService: DashboardService, private zone: NgZone, private toastrService: ToastrService) {
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
    let rawPath = this.new_monitor.path + ''
    if(rawPath.indexOf('http://') > -1 || rawPath.indexOf('mjpeg') > -1 || rawPath.indexOf('mjpg') > -1) {
      this.new_monitor.type = 'mjpeg';
      this.new_monitor.details.stream_type = 'mjpeg';
      this.new_monitor.details.vcodec = 'libx264';
      this.new_monitor.details.acodec = 'no';
      this.new_monitor.details.sfps = this.new_monitor.fps;
      this.new_monitor.details.stream_fps = this.new_monitor.fps;
    }
    if(rawPath.indexOf('://') > -1) {
      let isRTSP = false;
      if (rawPath.indexOf('rtsp://') > -1) {
        isRTSP = true
        this.new_monitor.path = this.new_monitor.path.replace('rtsp://', 'http://')
      }
      let parser: any = document.createElement('a');
      parser.href = this.new_monitor.path;

      this.new_monitor.mid = this.guid();
      this.new_monitor.protocol = parser.protocol.replace(':', '')
      if (isRTSP === true) {
        this.new_monitor.protocol = 'rtsp'
      }
      this.new_monitor.host = parser.hostname
      this.new_monitor.port = parser.port
      this.new_monitor.path = parser.pathname + parser.search
    }
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
    this.new_monitor = {
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
      details: {stream_type:''}
    };
  }

  hide(): void {
    this.modal.hide();
  }
}


