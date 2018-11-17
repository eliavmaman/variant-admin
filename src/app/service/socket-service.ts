import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";

(window as any).global = window;

@Injectable()
export class SocketService {
  private socket: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'Allow-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) {

    this.connectToShinobi();

    // this.socket.on('connect', (d: any) => {
    //   // this.socket.on('f', function (d) {
    //   //   console.log(d)
    //   // });
    // });
  }

  getShinobiAuth() {
    return this.http.post('//51.15.77.204?json=true', {
      machineID: 'fMUVxYdG1X3hWb7GNkTd',
      mail: 'ccio@m03.ca',
      pass: 'password',
      function: 'dash'
    }, this.httpOptions);
  }

  connectToShinobi() {
    this.socket = io('https://51.15.77.204/');

    this.getShinobiAuth().subscribe((res: any) => {
      let $user = res['$user'];
      localStorage.setItem('shinobi', JSON.stringify(res['$user']));
      this.socket.emit('f', {f: 'init', ke: $user.ke, auth: $user.auth_token, uid: $user.uid})


    });
  }

}
