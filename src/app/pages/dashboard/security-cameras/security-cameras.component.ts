import {Component} from '@angular/core';
import {Input} from "@angular/core";
import {SimpleChanges} from "@angular/core";
import * as _ from 'lodash';
import * as $ from "jquery";
import * as moment from "moment";
import {ViewChild} from "@angular/core";
import {ElementRef} from "@angular/core";
import {BlockUI, NgBlockUI} from 'ng-block-ui';


@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
})
export class SecurityCamerasComponent {
  @BlockUI() blockUI: NgBlockUI;
  @Input() detections: any;
  @Input() selectedCamera: string;
  @Input() monitors: any[];
  @Input() selectedTimeFrameVideos: string[] = [];
  @ViewChild('vid') video: any;
  currentCamera: string = 'https://cdn.shinobi.video/videos/people.mp4';
  selectedStream: string = '';
  frameCounter = 0;
  detectionDetails: any[] = [];
  interval: any;
  $box: any;
  bWidth: any;
  bHeight: any;
  cameras: any[] = [{
    id: 1,
    title: 'Camera #1',
    source: this.selectedStream//'https://cdn.shinobi.video/videos/people.mp4?autoplay=1&loop=1'
    //source: 'http://eye.variant.ai/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/X8FITn/jquery%7Cfullscreen',
  }, {
    id: 2,
    title: 'Camera #2',
    source: 'https://variant.shinobi.video/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/Demo/jquery%7Cfullscreen',
  }, {
    id: 3,
    title: 'Camera #3',
    source: 'https://variant.shinobi.video/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/XTBRDjf4um/jquery%7Cfullscreen',
  }, {
    id: 4,
    title: 'Camera #4',
    source: 'https://variant.shinobi.video/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/ZkEuo7mES8/jquery%7Cfullscreen',
  }];

  ngAfterViewInit() {
    this.$box = $('.video-container');
    let $videoInBox = this.$box.find('video');
    this.bWidth = $videoInBox.width();
    this.bHeight = $videoInBox.height();

    //Every second the video playing it get the relevant frame.
    this.video.nativeElement.ontimeupdate = () => {

      // let sec = parseInt(this.video.nativeElement.currentTime);
      //
      // //get cuurent frame
      // let currentDetection: any = this.detections[sec];
      //
      // //get monitor details or default width and height if not exsit
      // //let $monitorDetails = //(currentDetection.camera_id && this.monitors[currentDetection.camera_id]) ? JSON.parse(this.monitors[currentDetection.camera_id].details) :
      // let $monitorDetails = {
      //   detector_scale_x: 640,
      //   detector_scale_y: 480
      // };
      //
      //
      // let widthRatio = this.bWidth / $monitorDetails.detector_scale_x
      // let heightRatio = this.bHeight / $monitorDetails.detector_scale_y
      //
      // this.detectionDetails = this.getDetectionDetails(this.detectionDetails, sec);
      // this.frameCounter++;
      //
      // console.log(this.$box.find('.bb').length)
      // console.log()
      //
      //
      // this.$box.find('.bb').remove();
      // let div = '';
      // for (let i = 0; i < this.detectionDetails.length; i++) {
      //   if (this.detectionDetails[i].conf > 0.85) {
      //     let scaledLeft = this.detectionDetails[i].bb[0] * widthRatio
      //     let scaledTop = this.detectionDetails[i].bb[1] * heightRatio
      //     let scaledWidth = this.detectionDetails[i].bb[2] * widthRatio
      //     let scaledHeight = this.detectionDetails[i].bb[3] * heightRatio
      //     div += '<div class="bb" style="width:' + scaledWidth +
      //       'px;height:' + scaledHeight + 'px;top:' + scaledTop + 'px;left:' + scaledLeft + 'px;">' +
      //       '<div style="position: absolute;top:-20px;background-color: green">' + this.detectionDetails[i].conf + '</div>' +
      //       '</div>';
      //   }
      //
      // }
      // this.$box.append(div);

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.selectedCamera) {
    //   this.setSelectedCamera(changes.selectedCamera.currentValue);
    // }
    // if (changes.selectedTimeFrameVideos &&
    //   (changes.selectedTimeFrameVideos.currentValue && changes.selectedTimeFrameVideos.previousValue) &&
    //   changes.selectedTimeFrameVideos.currentValue[0] != changes.selectedTimeFrameVideos.previousValue[0]) {
    //   this.selectedStream = '//51.15.77.204' + changes.selectedTimeFrameVideos.currentValue[0].href;
    //
    //   this.currentCamera = this.selectedStream;
    //
    // }
    //
    // if (changes.detections && (changes.detections.currentValue && changes.detections.previousValue)) {
    //   this.frameCounter = 0;
    //
    //   // this.blockUI.stop();
    //
    //   if (this.detections.length == 0) {
    //     return;
    //   }
    //   if (this.interval)
    //     clearInterval(this.interval);
    //
    //   this.video.nativeElement.pause();
    //   this.video.nativeElement.currentTime = 0;
    //   this.video.nativeElement.play();
    //
    //   this.interval = setInterval(() => {
    //
    //   }, 1000);
    // }

    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  getDetectionDetails(detectionDetails: any, counter: any) {
    if (this.detections.length == 0) return [];
    detectionDetails = [];
    if (!this.detections[counter]) return;
    var sel = this.detections[counter].detections;
    if (moment(this.detections[counter + 1].detections).seconds() == moment(this.detections[counter].detections).seconds()) {
      sel = this.detections[counter + 1].detections;
    }
    let dd = sel;// this.detections[counter].detections;
    for (let i = 0; i < dd.length; i++) {
      detectionDetails.push({bb: dd[i].bbox_xywh, conf: dd[i].confidence});
    }

    return detectionDetails;
  }

  setSelectedCamera(cam_id) {
    if (!cam_id) return;
    var founded = _.find(this.cameras, (c) => {
      return c.id.toString() == cam_id.toString();
    });
    this.currentCamera = founded ? founded.source : '';
  }

  //selectedCamera: any = this.selectedCamera; //this.cameras[0];

  userMenu = [{
    title: 'Profile',
  }, {
    title: 'Log out',
  }];

  isSingleView = true;

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }
}
