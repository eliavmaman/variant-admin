import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {

  }

  herokuUrl = 'https://variant-ai-server.herokuapp.com';
  local = "http://localhost:3000";


  getDetedctions(from: any, to: any) {
    //this.herokuUrl = this.local;
    return this.http.get(this.herokuUrl + '/api/detections', {
      params: {
        fromDate: from,
        toDate: to
      }
    });
  }

  getLiveCount() {
    //this.herokuUrl = this.local;
    return this.http.get(this.herokuUrl + '/api/livecount');
  }

  getFramesByDate(from: any, to: any) {

    if (localStorage.getItem('shinobi') != null) {
      let shinobiData: any = JSON.parse(localStorage.getItem('shinobi'));


      let fIso = from.toISOString().split('.')[0];
      let eIso = to.toISOString().split('.')[0];

      return this.http.get('//51.15.77.204/' + shinobiData.auth_token + '/videos/' + shinobiData.ke +
        '/2DWD9ju3Vw?start=' + fIso + '&endIsStartTo&end=' + eIso);
    }


  }

}
