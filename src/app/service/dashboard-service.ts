import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {

  }
  herokuUrl = 'https://variant-ai-server.herokuapp.com';
  local = "http://localhost:3000";

  getDetedctions(from: any, to: any) {

    return this.http.get(this.herokuUrl + '/api/detections', {
      params: {
        fromDate: from.toISOString(),
        toDate: to.toISOString()
      }// observe: 'response'
    });
  }

  getGender1() {
    return this.http.get('http://51.15.209.55:8002/api/getGender/demo1');//.subscribe((res: any) => {return res.data;})
  }

  getAge1() {
    return this.http.get('http://51.15.209.55:8002/api/getAge/demo1');//.subscribe((res: any) => {return res.data;})
  }

  getEmotion1() {
    return this.http.get('http://51.15.209.55:8002/api/getEmotion/demo1');
    //.subscribe((res: any) => {return res.data;})
  }

  getGender2() {
    return this.http.get('http://51.15.209.55:8002/api/getGender/demo2');//.subscribe((res: any) => {return res.data;})
  }

  getAge2() {
    return this.http.get('http://51.15.209.55:8002/api/getAge/demo2');//.subscribe((res: any) => {return res.data;})
  }

  getEmotion2() {
    return this.http.get('http://51.15.209.55:8002/api/getEmotion/demo2');
    //.subscribe((res: any) => {return res.data;})
  }

  getGender3() {
    return this.http.get('http://51.15.209.55:8002/api/getGender/demo3');//.subscribe((res: any) => {return res.data;})
  }

  getAge3() {
    return this.http.get('http://51.15.209.55:8002/api/getAge/demo3');//.subscribe((res: any) => {return res.data;})
  }

  getEmotion3() {
    return this.http.get('http://51.15.209.55:8002/api/getEmotion/demo3');
    //.subscribe((res: any) => {return res.data;})
  }

  getGender4() {
    return this.http.get('http://51.15.209.55:8002/api/getGender/demo4');//.subscribe((res: any) => {return res.data;})
  }

  getAge4() {
    return this.http.get('http://51.15.209.55:8002/api/getAge/demo4');//.subscribe((res: any) => {return res.data;})
  }

  getEmotion4() {
    return this.http.get('http://51.15.209.55:8002/api/getEmotion/demo4');
    //.subscribe((res: any) => {return res.data;})
  }
}
