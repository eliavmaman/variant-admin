import { Component } from '@angular/core';


@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html',
})
export class SecurityCamerasComponent {

  cameras: any[] = [{
    title: 'Camera #1',
    source: 'https://eye.variant.ai/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/X8FITn/jquery%7Cfullscreen',
  }, {
    title: 'Camera #2',
    source: 'https://eye.variant.ai/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/Demo/jquery%7Cfullscreen',
  }, {
    title: 'Camera #3',
    source: 'https://eye.variant.ai/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/XTBRDjf4um/jquery%7Cfullscreen',
  }, {
    title: 'Camera #4',
    source: 'https://eye.variant.ai/cOxz0KrvaJesq9yqDc50ybnpmZL6cF/embed/2Df5hBE/ZkEuo7mES8/jquery%7Cfullscreen',
  }];

  selectedCamera: any = this.cameras[0];

  userMenu = [{
    title: 'Profile',
  }, {
    title: 'Log out',
  }];

  isSingleView = false;

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }
}
