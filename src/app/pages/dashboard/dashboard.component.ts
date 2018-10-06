import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../service/dashboard-service';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {NgZone} from "@angular/core";
import * as moment from 'moment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  summaryDescription: string = '';
  totalCriteriaCount: number = 0;
  emotions: any[] = ['All', 'Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
  ageRanges: any[] = ['All', '0-20', '20-40', '40+'];
  gender: any[] = ['All', 'Male', 'Female'];
  criteria = {gender: 'All', emotion: 'All', ageRanges: 'All'};
  chartsDummyGlobalData = {
    gender: [],
    age: [],
    emotion: [],
    total: 0
  };
  detections: any[] = [];
  people: any = [];
  public daterange: any = {};

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: {format: 'DD-MM-YYYY HH:mm'},
    startDate: moment().format('DD-MM-YYYY HH:mm'),
    endDate: moment().format('DD-MM-YYYY HH:mm'),
    timePicker: true,
    timePicker24Hour: true,
    alwaysShowCalendars: false
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);
    this.people = [];
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

    this.blockUI.start('Loading...');
    this.dashboardService.getDetedctions(this.daterange.start, this.daterange.end).subscribe((res: any) => {
      this.detections = res;

      let peoples = {};
      res.forEach((d) => {

        d.detections.forEach((det) => {

          var pid = det.object.split(' ')[1];
          if (peoples[pid]) {
            peoples[pid].gender = det.gender.length == 0 ? peoples[pid].gender : det.gender;
            peoples[pid].emotions.push(det.emotion);
            peoples[pid].confidences.push(det.confidence);
          } else {
            peoples[pid] = {};
            peoples[pid].gender = det.gender;
            peoples[pid].emotions = [det.emotion];
            peoples[pid].confidences = [det.confidence];
          }
        });


      });

      for (var property in peoples) {
        if (peoples.hasOwnProperty(property)) {
          peoples[property].confidence = getAvgConf(peoples[property]);
          peoples[property].emotion = getAvgEmotion(peoples[property].emotions);
        }
      }
//                peoples.forEach((p) => {
//                    p.confidence = getAvgConf(p);
//                    p.emotion = getAvgEmotion(p.emotions);
//                });

      function getAvgConf(p) {
        var sum = 0;
        for (var i = 0; i < p.confidences.length; i++) {
          sum += parseFloat(p.confidences[i]);
        }

        var avg = sum / p.confidences.length;

        return avg;
      }

      function getAvgEmotion(array) {
        if (array.length == 0)
          return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for (var i = 0; i < array.length; i++) {
          var el = array[i];
          if (modeMap[el] == null)
            modeMap[el] = 1;
          else
            modeMap[el]++;
          if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
          }
        }
        return maxEl;
      }

      for (var key in peoples) {
        var obj = peoples[key];
        this.people.push(obj);
      }
      let tempData: any = {
        age: [],
        gender: [],
        emotion: [],
        total: 0
      };

      this.people.forEach((p) => {
        tempData.age.push(p.age);
        tempData.gender.push(p.gender);
        tempData.emotion.push(p.emotion);
      });

      let realData: any = {
        age: this.getChartObjectCount(tempData.age),
        gender: this.getChartObjectCount(tempData.gender),
        emotion: this.getChartObjectCount(tempData.emotion)
      };


      //'Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'

      this.zone.run(() => {
        this.chartsDummyGlobalData = {
          gender: [],
          age: [],
          emotion: [],
          total: 0
          // gender: [100, 128],
          // age: [3, 12, 40],
          // emotion: [10, 13, 16, 8, 0, 0, 7],
          // total: 0
        };
        for (let prop in realData.age) {
          this.chartsDummyGlobalData.age.push(
            prop ? realData[prop] : 0);
        }

        this.chartsDummyGlobalData.gender = [
          realData.gender['man'] || 0,
          realData.gender['woman'] || 0
        ];

        this.chartsDummyGlobalData.emotion = [
          realData.emotion['angry'] || 0,
          realData.emotion['disgust'] || 0,
          realData.emotion['fear'] || 0,
          realData.emotion['happy'] || 0,
          realData.emotion['neutral'] || 0,
          realData.emotion['sad'] || 0,
          realData.emotion['surprise'] || 0
        ];

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
        this.applyCriteria();
        this.chartsDummyGlobalData.total = this.getTotalCount();

        this.blockUI.stop();
      });
    });
  }

  getChartObjectCount(a: any) {
    // let aCount:any = new Map([...new Set(arr)].map(
    //   x => [x, arr.filter(y => y === x).length]
    // ));
    //
    // return aCount;
    let result = {};
    for (var i = 0; i < a.length; ++i) {
      if (!result[a[i]])
        result[a[i]] = 0;
      ++result[a[i]];
    }

    return result;
  }

  applyCriteria() {
    const genderIndex = this.gender.indexOf(this.criteria.gender);
    const emotionIndex = this.emotions.indexOf(this.criteria.emotion);
    const ageIndex = this.ageRanges.indexOf(this.criteria.ageRanges);


    var totalGender = this.getGenderTotal(genderIndex);
    var totalEmotion = this.getEmotionTotal(emotionIndex);
    var totalAge = this.getAgeTotal(ageIndex);
    this.totalCriteriaCount = (
      totalGender +
      totalEmotion +
      totalAge
    );

    this.getDescription(totalAge, totalEmotion, totalGender);
  }

  getGenderTotal(genderIndex: any): any {
    let sum = 0;
    if (this.criteria.gender === 'All') {
      this.chartsDummyGlobalData.gender.forEach((g) => {
        sum += g;
      });

      return sum;
    } else if (this.criteria.gender === 'None')
      return 0;
    else {
      // let genderIndex = this.gender.indexOf(this.criteria.gender);
      return this.chartsDummyGlobalData.gender[genderIndex];
    }
  }

  getEmotionTotal(emotionIndex: any): any {
    let sum = 0;
    if (this.criteria.emotion === 'All') {
      this.chartsDummyGlobalData.emotion.forEach((g) => {
        sum += g;
      });

      return sum;
    } else if (this.criteria.emotion === 'None')
      return 0;
    else {
      // let emotionIndex = this.emotions.indexOf(this.criteria.emotion);
      return this.chartsDummyGlobalData.emotion[emotionIndex];
    }
  }

  getAgeTotal(ageIndex: any): any {
    let sum = 0;
    if (this.criteria.ageRanges === 'All') {
      this.chartsDummyGlobalData.age.forEach((g) => {
        sum += g;
      });

      return sum;
    } else if (this.criteria.ageRanges === 'None')
      return 0;
    else {
      //let ageIndex = this.age.indexOf(this.criteria.age);
      return this.chartsDummyGlobalData.age[ageIndex];
    }
  }

  getDescription(ageTotal, emotionTotal, genderTotal) {
    let str = '';
    if (this.criteria.gender != 'None') {
      str += 'Gender (' + genderTotal + '), ';
    }
    if (this.criteria.emotion != 'None') {
      str += 'Emotion (' + emotionTotal + '), ';
    }

    if (this.criteria.ageRanges != 'None') {
      str += 'Age (' + (ageTotal || 'Not detected') + '), ';
    }


    this.summaryDescription = str;
    // this.summaryDescription =
    //   this.criteria.gender + ' (' + this.chartsDummyGlobalData.gender[genderIndex] + ')' + ' - ' +
    //   this.criteria.emotion + ' (' + this.chartsDummyGlobalData.emotion[emotionIndex] + ')' + ' - ' +
    //   this.criteria.ageRanges + ' (' + this.chartsDummyGlobalData.age[ageIndex] + ')'
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
