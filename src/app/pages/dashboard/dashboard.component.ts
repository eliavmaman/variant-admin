import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../service/dashboard-service';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {NgZone} from "@angular/core";

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  summaryDescription:string='';
  totalCriteriaCount: number = 0;
  emotions: any[] = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
  ageRanges: any[] = ['0-20', '20-40', '40+'];
  gender: any[] = ['Male', 'Female'];
  criteria = {gender: 'Male', emotion: 'Happy', ageRanges: this.ageRanges[0]};
  chartsDummyGlobalData = {
    gender: [100, 128],
    age: [3, 12, 40],
    emotion: [10, 13, 16, 8, 0, 0, 7],
    total: 0
  };

  applyCriteria() {
    let genderIndex = this.gender.indexOf(this.criteria.gender);
    let emotionIndex = this.emotions.indexOf(this.criteria.emotion);
    let ageIndex = this.ageRanges.indexOf(this.criteria.ageRanges);

    this.totalCriteriaCount = (
      this.chartsDummyGlobalData.gender[genderIndex] +
      this.chartsDummyGlobalData.emotion[emotionIndex] +
      this.chartsDummyGlobalData.age[ageIndex]
    )

    this.getDescription(ageIndex, emotionIndex, genderIndex);
  }

  getDescription(ageIndex, emotionIndex, genderIndex) {
    this.summaryDescription =
      this.criteria.gender + ' (' + this.chartsDummyGlobalData.gender[genderIndex] + ')' + ' - ' +
      this.criteria.emotion + ' (' + this.chartsDummyGlobalData.emotion[emotionIndex] + ')' + ' - ' +
      this.criteria.ageRanges + ' (' + this.chartsDummyGlobalData.age[ageIndex] + '): Total:' + this.totalCriteriaCount;
  }

  cameras: any = [
    {id: 1, name: 'Kitchen'},
    {id: 2, name: 'Entrance'},
    {id: 3, name: 'Cashiers'},
    {id: 4, name: 'Food Court'}
  ];

  selectedCamera: any = this.cameras[0].id;
  genderCamera = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: this.chartsDummyGlobalData.gender
    }],
  };
  ageCamera = {
    labels: this.ageRanges,
    datasets: [{
      data: this.chartsDummyGlobalData.age
    }],
  };
  emotionCamera = {
    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
    datasets: [{
      data: this.chartsDummyGlobalData.emotion,
    }],
  };
  camData4 = {
    labels: ['Gender', 'Age', 'Emotion'],
    datasets: [{
      data: []
    }],
  };

  constructor(private dashboardService: DashboardService, private zone: NgZone) {
  }

  ngOnInit() {
    this.getCamera1Data();
    this.getCamera2Data();
    this.getCamera3Data();
    this.getCamera4Data();
  }

  getCamera1Data() {
    const age = this.dashboardService.getAge1();
    const gender = this.dashboardService.getGender1();
    const emo = this.dashboardService.getEmotion1();

    forkJoin([gender, age, emo]).subscribe((res: any) => {
      // this.camData1.datasets = [res[0].length, res[1].length, res[2].length];
    });
  }

  getCamera2Data() {
    const age = this.dashboardService.getAge2();
    const gender = this.dashboardService.getGender2();
    const emo = this.dashboardService.getEmotion2();
    forkJoin([gender, age, emo]).subscribe((res: any) => {
      // this.camData2.datasets = [res[0].length, res[1].length, res[2].length];
    });
  }

  getCamera3Data() {
    const age = this.dashboardService.getAge1();
    const gender = this.dashboardService.getGender1();
    const emo = this.dashboardService.getEmotion1();
    forkJoin([gender, age, emo]).subscribe((res: any) => {
      //  this.camData3.datasets = [res[0].length, res[1].length, res[2].length];
    });
  }

  getCamera4Data() {
    const age = this.dashboardService.getAge1();
    const gender = this.dashboardService.getGender1();
    const emo = this.dashboardService.getEmotion1();
    forkJoin([gender, age, emo]).subscribe((res: any) => {
      //  this.camData4.datasets = [res[0].length, res[1].length, res[2].length];
    });
  }

  onCameraSelected(camera) {
    this.selectedCamera = camera;
    this.zone.run(() => {
      this.getRandomChartData();
      this.applyCriteria();
    });

  }

  getRandomChartData() {
    this.chartsDummyGlobalData.age = [
      this.getRandomNumber(),
      this.getRandomNumber(),
      this.getRandomNumber()
    ];
    this.chartsDummyGlobalData.gender = [this.getRandomNumber(), this.getRandomNumber()];
    this.chartsDummyGlobalData.emotion = [this.getRandomNumber(),
      this.getRandomNumber(),
      this.getRandomNumber(),
      this.getRandomNumber(),
      this.getRandomNumber(),
      this.getRandomNumber(),
      this.getRandomNumber()];

    this.genderCamera = {
      labels: ['Male', 'Female'],
      datasets: [{
        data: this.chartsDummyGlobalData.gender
      }],
    };
    this.ageCamera = {
      labels: ['0-20', '20-40', '40+'],
      datasets: [{
        data: this.chartsDummyGlobalData.age
      }],
    };
    this.emotionCamera = {
      labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
      datasets: [{
        data: this.chartsDummyGlobalData.emotion,
      }],
    };

    this.chartsDummyGlobalData.total = this.getTotalCount()

  }

  getRandomNumber() {

    return Math.floor(Math.random() * (15 - 0 + 1));

  }

  getTotalCount() {
    if (!this.chartsDummyGlobalData) return;
    var t_age = this.chartsDummyGlobalData.age.reduce((a, b) => a + b, 0);
    var t_gender = this.chartsDummyGlobalData.gender.reduce((a, b) => a + b, 0);
    var t_emotion = this.chartsDummyGlobalData.emotion.reduce((a, b) => a + b, 0);
    return (t_emotion + t_age + t_gender);
  }


}

// import {Component, OnDestroy} from '@angular/core';
// import { NbThemeService } from '@nebular/theme';
// import { takeWhile } from 'rxjs/operators/takeWhile' ;
//
// interface CardSettings {
//   title: string;
//   iconClass: string;
//   type: string;
// }
//
// @Component({
//   selector: 'ngx-dashboard',
//   styleUrls: ['./dashboard.component.scss'],
//   templateUrl: './dashboard.component.html',
// })
// export class DashboardComponent implements OnDestroy {
//
//   private alive = true;
//
//   lightCard: CardSettings = {
//     title: 'Light',
//     iconClass: 'nb-lightbulb',
//     type: 'primary',
//   };
//   rollerShadesCard: CardSettings = {
//     title: 'Roller Shades',
//     iconClass: 'nb-roller-shades',
//     type: 'success',
//   };
//   wirelessAudioCard: CardSettings = {
//     title: 'Wireless Audio',
//     iconClass: 'nb-audio',
//     type: 'info',
//   };
//   coffeeMakerCard: CardSettings = {
//     title: 'Coffee Maker',
//     iconClass: 'nb-coffee-maker',
//     type: 'warning',
//   };
//
//   statusCards: string;
//
//   commonStatusCardsSet: CardSettings[] = [
//     this.lightCard,
//     this.rollerShadesCard,
//     this.wirelessAudioCard,
//     this.coffeeMakerCard,
//   ];
//
//   statusCardsByThemes: {
//     default: CardSettings[];
//     cosmic: CardSettings[];
//     corporate: CardSettings[];
//   } = {
//     default: this.commonStatusCardsSet,
//     cosmic: this.commonStatusCardsSet,
//     corporate: [
//       {
//         ...this.lightCard,
//         type: 'warning',
//       },
//       {
//         ...this.rollerShadesCard,
//         type: 'primary',
//       },
//       {
//         ...this.wirelessAudioCard,
//         type: 'danger',
//       },
//       {
//         ...this.coffeeMakerCard,
//         type: 'secondary',
//       },
//     ],
//   };
//
//   constructor(private themeService: NbThemeService) {
//     this.themeService.getJsTheme()
//       .pipe(takeWhile(() => this.alive))
//       .subscribe(theme => {
//         this.statusCards = this.statusCardsByThemes[theme.name];
//     });
//   }
//
//   ngOnDestroy() {
//     this.alive = false;
//   }
// }
