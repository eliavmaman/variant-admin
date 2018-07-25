import {Component} from '@angular/core';
import {Input} from "@angular/core";
import {SimpleChanges} from "@angular/core";
import * as _ from 'lodash';


@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
})
export class SecurityCamerasComponent {
  @Input() selectedCamera: string;
  currentCamera: string;
  cameras: any[] = [{
    id: 1,
    title: 'Camera #1',
    source: 'https://variant.shinobi.video/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/X8FITn/jquery%7Cfullscreen'
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

  ngOnChanges(changes: SimpleChanges) {

    this.setSelectedCamera(changes.selectedCamera.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  setSelectedCamera(cam_id) {
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
