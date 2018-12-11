import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../service/dashboard-service';
import {SocketService} from '../../service/socket-service';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {NgZone} from '@angular/core';
import * as moment from 'moment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {DaterangePickerComponent} from 'ng2-daterangepicker';
import * as $ from "jquery";
import {IMultiSelectOption, IMultiSelectSettings} from "angular-2-dropdown-multiselect";
import * as _ from 'lodash';
import {NbColorHelper} from "@nebular/theme";
import {NbThemeService} from "@nebular/theme";
import {OnDestroy} from "@angular/core";
import {NbJSThemeVariable} from "@nebular/theme/services/js-themes/theme.options";


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  @BlockUI() blockUI: NgBlockUI;

  summaryDescription: string = '';
  totalCriteriaCount: number = 0;
  emotions: any[] = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
  ageRanges: any[] = ['0-9', '10-19', '20-29', '30-39', '40-49', '50+'];
  gender: any[] = ['Male', 'Female'];
  criteria = {gender: 'All', emotion: 'All', ageRanges: 'All'};
  chartsDummyGlobalData = {
    gender: [],
    age: [],
    emotion: [],
    total: 0
  };
  liveCount: number = 0;
  liveCountInterval: any;
  emotionModel: string[];
  emotionOptions: IMultiSelectOption[] = [];
  settings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true
  }
  monitors: any[];
  detections: any[] = [];
  people: any = [];
  selectedTimeFrameVideos = [];
  selectedMonitor: any;// made for KYLE demo 29.11.18 remove after
  public daterange: any = {};


  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: {format: 'DD-MM-YYYY HH:mm'},
    // startDate: moment().subtract(1, 'hours').format('DD-MM-YYYY HH:mm'),
    // endDate: moment().format('DD-MM-YYYY HH:mm'),
    timePicker: true,
    timePicker24Hour: true,
    alwaysShowCalendars: false
  };
  themeSubscription: any;
  colors: NbJSThemeVariable;
  genderCamera = {
    labels: this.gender,
    datasets: [],
  };



  emotionCamera = {
    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
    datasets: [{
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Happy',
      backgroundColor: NbColorHelper.hexToRgbA('#9ACD32', 0.3),
      borderColor: '#9ACD32',
    }, {
      data: [28, 48, 40, 19, 86, 27, 90],
      label: 'Neutral',
      backgroundColor: NbColorHelper.hexToRgbA('#0000ff', 0.3),
      borderColor: '#0000ff',
    }],
    // datasets: [{
    //   data: this.chartsDummyGlobalData.emotion,
    // }],
  };
  ageCamera:any;

  constructor(private dashboardService: DashboardService, private zone: NgZone, private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.ageCamera = {
        labels: this.ageRanges,
        datasets: [{
          data: [65, 59, 80, 81, 56, 55, 40],
          label: 'Male',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.info, 1)
        }, {
          data: [28, 48, 40, 19, 86, 27, 90],
          label: 'Female',
          backgroundColor:  NbColorHelper.hexToRgbA(this.colors.danger, 1)
        }],
        // datasets: [{
        //   data: this.chartsDummyGlobalData.age
        // }],
      };
    });
  }

  ngOnInit() {
    if (this.liveCountInterval) {
      clearInterval(this.liveCountInterval);
    }
    this.emotions.forEach((em) => {
      this.emotionOptions.push({
        id: em,
        name: em
      });


    })

    // this.liveCountInterval = setInterval(() => {
    //   this.dashboardService.getLiveCount().subscribe((res: any) => {
    //     let detections = res;
    //
    //     let peoples = [];
    //     detections.forEach((d) => {
    //       d.detections.forEach((det) => {
    //         if (peoples.indexOf(det.object) == -1) {
    //           peoples.push(det.object);
    //         }
    //       });
    //     });
    //
    //     this.liveCount = peoples.length;
    //   })
    // }, 10000);
  }

  ngAfterViewInit() {
    const from = moment().subtract(1, 'hours');
    const to = moment();
    this.picker.datePicker.setStartDate(from.format('DD-MM-YYYY HH:mm'));

    this.picker.datePicker.setEndDate(to.format('DD-MM-YYYY HH:mm'));
    //this.blockUI.start('Loading...');
    // this.dashboardService.getAllMonitors().subscribe((res: any) => {
    //   this.selectedMonitor = _.find(res, (m) => {
    //     return m.mid == 'BQ5X7YbmUj'
    //   });
    //   if (this.selectedMonitor) {
    //     this.dashboardService.getFramesByDate(from, to, this.selectedMonitor.mid).subscribe((res: any) => {
    //
    //       if (!res.videos || (res.videos && res.videos.length == 0)) {
    //         alert('No recording videos were found');
    //         this.blockUI.stop();
    //         return false;
    //       }
    //
    //       this.selectedTimeFrameVideos = res.videos;
    //       let start = res.videos[0].time;
    //       let end = res.videos[0].end;
    //       this.getDetectionsByTimeFrame(start, end);
    //     });
    //   }
    //
    // });
    // this.getAllMonitors();
  }

  getAllMonitors() {
    this.dashboardService.getAllMonitors().subscribe((res: any) => {

      let obj: any = {};
      res.forEach((m) => {
        obj[m.mid] = m;
      })
      this.monitors = obj;
    })
  }

  public selectedDate(value: any, datepicker?: any) {
    // if (this.interval)
    //   clearInterval(this.interval);
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
    this.dashboardService.getFramesByDate(this.daterange.start, this.daterange.end, this.selectedMonitor.mid).subscribe((res: any) => {
      this.emotionModel = [];
      if (res.videos.length == 0) {
        alert('No recording videos were found');
        this.blockUI.stop();
        return false;
      }

      this.selectedTimeFrameVideos = res.videos;
      let start = res.videos[0].time;
      let end = res.videos[0].end;
      this.getDetectionsByTimeFrame(start, end);
    });
  }

  getDetectionDetails(detectionDetails: any, counter: any) {
    if (this.detections.length == 0) return [];
    detectionDetails = [];
    let dd = this.detections[counter].detections;
    for (let i = 0; i < dd.length; i++) {
      detectionDetails.push(dd[i].bbox_xywh);
    }

    return detectionDetails;
  }

  private getDetectionsByTimeFrame(from, to) {
    this.dashboardService.getDetedctions(from, to).subscribe((res: any) => {


      // let counter = 0;


      // res = res.sort((a: any, b: any) => {
      //   // Turn your strings into dates, and then subtract them
      //   // to get a value that is either negative, positive, or zero.
      //   // return Math.abs(new Date(b.arrivedAt).getTime() - new Date(a.arrivedAt).getTime());
      //   return moment.utc(a.arrivedAt, 'DD/MM/YYYY').diff(moment.utc(b.arrivedAt, 'DD/MM/YYYY'));
      // });
      var tmpRes = [];
      let lastSecond: any = 0;
      let lastMinute: any = 0;

      res.sort(function (left, right) {
        return moment.utc(left.arrivedAt).diff(moment.utc(right.arrivedAt))
      });

      // res.forEach((r) => {
      //   let sec = moment(r.arrivedAt).format('ss');
      //   let minute = moment(r.arrivedAt).format('mm');
      //   if (lastMinute != minute || sec != lastSecond) {
      //     tmpRes.push(r);
      //     lastSecond = sec;
      //     lastMinute = minute;
      //   }
      // })
      this.detections = res;

      // this.detections.forEach((d: any) => {
      //   console.log(d.arrivedAt);
      // })
      // this.blockUI.stop();


      //
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

      for (let property in peoples) {
        if (peoples.hasOwnProperty(property)) {
          peoples[property].confidence = getAvgConf(peoples[property]);
          peoples[property].emotion = getAvgEmotion(peoples[property].emotions);
        }
      }

      function getAvgConf(p) {
        let sum = 0;
        for (let i = 0; i < p.confidences.length; i++) {
          sum += parseFloat(p.confidences[i]);
        }

        let avg = sum / p.confidences.length;

        return avg;
      }

      function getAvgEmotion(array) {
        if (array.length == 0)
          return null;
        let modeMap = {};
        let maxEl = array[0], maxCount = 1;
        for (let i = 0; i < array.length; i++) {
          let el = array[i];
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

      for (let key in peoples) {
        let obj = peoples[key];
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
          labels: this.gender,
          datasets: [{
            data: this.chartsDummyGlobalData.gender
          }],
        };

        // this.ageCamera = {
        //   labels: this.ageRanges,
        //   datasets: [{
        //     data: this.chartsDummyGlobalData.age
        //   }],
        // };
        //
        // this.emotionCamera = {
        //   labels: this.emotions,
        //   datasets: [{
        //     data: this.chartsDummyGlobalData.emotion
        //   }],
        // };

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
    const ageIndex = this.ageRanges.indexOf(this.criteria.ageRanges);


    var totalGender = this.getGenderTotal(genderIndex);
    var totalEmotion = this.getEmotionTotal();
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

  getEmotionTotal(): any {
    let sum = 0;
    if (!this.emotionModel) return 0;
    this.emotionModel.forEach((em) => {
      const emotionIndex = this.emotions.indexOf(em);
      if (emotionIndex > -1)
        sum += this.chartsDummyGlobalData.emotion[emotionIndex];
    });
    return sum;
    // if (!this.emotionModel) return 0;
    // if (this.emotionModel.indexOf('All') > -1) {
    //   this.chartsDummyGlobalData.emotion.forEach((g) => {
    //     sum += g;
    //   });
    //
    //   return sum;
    // } else if (this.emotionModel.indexOf('None') > -1)
    //   return 0;
    // else {
    // }
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

    str += ' - Total people detected in frame: ' + this.people.length;


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


  onEmotionChange() {
    console.log(this.emotionModel);
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

    // this.genderCamera = {
    //   labels: ['Male', 'Female'],
    //   datasets: [{
    //     data: this.chartsDummyGlobalData.gender
    //   }],
    // };
    // this.ageCamera = {
    //   labels: ['0-20', '20-40', '40+'],
    //   datasets: [{
    //     data: this.chartsDummyGlobalData.age
    //   }],
    // };
    // this.emotionCamera = {
    //   labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
    //   datasets: [{
    //     data: this.chartsDummyGlobalData.emotion,
    //   }],
    // };

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

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
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
