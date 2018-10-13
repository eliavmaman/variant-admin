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
        fromDate: from,
        toDate: to
      }
    });
  }

  getFramesByDate(from: any, to: any) {

    if (localStorage.getItem('shinobi') != null) {
      let shinobiData: any = JSON.parse(localStorage.getItem('shinobi'));

      return this.http.get('http://51.15.77.204/' + shinobiData.auth_token + '/videos/' + shinobiData.ke +
        '/2DWD9ju3Vw?start=' + from.format('YYYY-MM-DDTHH:mm:ss') + '&end=' + to.format('YYYY-MM-DDTHH:mm:ss'));
    }


  }

}
