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
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  emotions: any[] = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
  ages: any[] = ['0-9', '10-19', '20-29', '30-39', '40-49', '50+'];
  gender: any[] = ['Male', 'Female'];

  summaryDescription: string = '';
  totalCriteriaCount: number = 0;

  criteria = {gender: 'All', emotion: 'All', ages: 'All'};

  chartsModel = {
    age: {
      males: [0, 0, 0, 0, 0, 0],
      females: [0, 0, 0, 0, 0, 0]
    },
    emotion: [0, 0, 0, 0, 0, 0, 0],
    total:
      0
  };


  liveCount: number = 0;
  liveCountInterval: any;

  emotionModel: string[];
  agesModel: string[];
  gendersModel: string[];
  emotionOptions: IMultiSelectOption[] = [];
  ageOptions: IMultiSelectOption[] = [];
  genderOptions: IMultiSelectOption[] = [];
  settings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true
  };

  monitors: any[] = [];
  detections: any[] = [];
  people: any = [];

  selectedTimeFrameVideos = [];
  selectedCamera: any;// made for KYLE demo 29.11.18 remove after
  public
  daterange: any = {};

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
  agesChartData: any;
  emotionChartData: any;

  constructor(
    private dashboardService: DashboardService,
    private zone: NgZone,
    private theme: NbThemeService,
    private socketService: SocketService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.agesChartData = {
        labels: this.ages,
        datasets: [{
          data: [65, 59, 80, 81, 56, 55],
          label: 'Male',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.info, 1)
        }, {
          data: [28, 48, 40, 19, 86, 27],
          label: 'Female',
          backgroundColor: NbColorHelper.hexToRgbA(this.colors.danger, 1)
        }],
        // datasets: [{
        //   data: this.chartsDummyGlobalData.age
        // }],
      };
      this.emotionChartData = {
        labels: this.emotions,
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
    });
  }

  ngOnInit() {
    if (this.liveCountInterval) {
      clearInterval(this.liveCountInterval);
    }
    this.initiatEmotionMultiSelect();

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

  private initiatEmotionMultiSelect() {
    this.emotions.forEach((em: any) => {
      this.emotionOptions.push({
        id: em,
        name: em
      });
    });
    this.ages.forEach((ag: any) => {
      this.ageOptions.push({
        id: ag,
        name: ag
      });
    });
    this.gender.forEach((g: any) => {
      this.genderOptions.push({
        id: g,
        name: g
      });
    });
  }

  ngAfterViewInit() {
    const {from, to} = this.initiateDatePickers();
    this.daterange.start = from;
    this.daterange.end = to;
   // this.blockUI.start('Loading...');

    this.dashboardService.getAllMonitors().subscribe((res: any) => {
      if (!Array.isArray(res)) {
        this.ngAfterViewInit();
      }
      this.monitors = res;

      this.selectedCamera = this.monitors[0];

      if (this.selectedCamera) {
        // this.dashboardService.getFramesByDate(from, to, this.selectedCamera.mid).subscribe((res: any) => {
        //
        //   if (!res.videos || (res.videos && res.videos.length == 0)) {
        //     alert('No recording videos were found for the selected time frame');
        //     this.blockUI.stop();
        //     return false;
        //   }
        //
        //   this.getVideoFrames(res);
        // });
      }

    });
    // this.getAllMonitors();
  }

  private initiateDatePickers() {
    const from = moment().subtract(1, 'hours');
    const to = moment();
    this.picker.datePicker.setStartDate(from.format('DD-MM-YYYY HH:mm'));
    this.picker.datePicker.setEndDate(to.format('DD-MM-YYYY HH:mm'));
    return {from, to};
  }

  private getVideoFrames(data: any) {
    this.selectedTimeFrameVideos = data.videos;
    const start = data.videos[0].time;
    const end = data.videos[0].end;

    this.getDetectionsByTimeFrame(start, end);
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

  public selectedDate(value: any, datepicker ?: any) {
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

    //TODO create function that can be called from camera selection
    this.getMonitorFrames();

  }

  private getMonitorFrames() {
    this.blockUI.start('Loading...');
    this.dashboardService.getFramesByDate(this.daterange.start, this.daterange.end, this.selectedCamera.mid)
      .subscribe((res: any) => {
        this.emotionModel = [];
        if (res.videos.length == 0) {
          alert('No recording videos were found for the selected time frame');
          this.blockUI.stop();
          return false;
        }

        this.selectedTimeFrameVideos = res.videos;
        let start = res.videos[0].time;
        let end = res.videos[0].end;
        this.getDetectionsByTimeFrame(start, end);
      });
  }

  getAgeGenderChartData(detections: any[]) {
    const agesMales = [0, 0, 0, 0, 0, 0];
    const agesFemales = [0, 0, 0, 0, 0, 0];

    detections.forEach((d) => {
      switch (d.age) {
        case d.age > 0 && d.age <= 9:
          d.gender === 'male' ? agesMales[0]++ : agesFemales[0]++;
          break;
        case d.age >= 10 && d.age <= 19:
          d.gender === 'male' ? agesMales[1]++ : agesFemales[1]++;
          break;
        case d.age >= 20 && d.age <= 29:
          d.gender === 'male' ? agesMales[2]++ : agesFemales[2]++;
          break;
        case d.age >= 30 && d.age <= 39:
          d.gender === 'male' ? agesMales[3]++ : agesFemales[3]++;
          break;
        case d.age >= 40 && d.age <= 49:
          d.gender === 'male' ? agesMales[4]++ : agesFemales[4]++;
          break;
        case d.age > 50 :
          d.gender === 'male' ? agesMales[0]++ : agesFemales[0]++;
          break;
      }
    });

    this.chartsModel.age.males = agesMales;
    this.chartsModel.age.females = agesFemales;
  }

  getDetectionsByTimeFrame(from, to) {

    this.dashboardService.getDetedctions(from, to).subscribe((res: any) => {
      this.detections = res;

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
      res.forEach((d) => {
        this.getAgeGenderChartData(d.detections);
      });

      this.zone.run(() => {
        this.blockUI.stop();
      });
    }, (err) => {
      this.blockUI.stop();
    });
  }

  applyCriteria() {
//TODO finish description
    const totalGender = this.getGenderTotal();

    //var totalEmotion = this.getEmotionTotal();
    //var totalAge = this.getAgeTotal(ageIndex);
    // this.totalCriteriaCount = (
    //   totalGender +
    //   totalEmotion +
    //   totalAge
    // );
    //
    // this.getDescription(totalAge, totalEmotion, totalGender);
  }

  getGenderTotal(): any {
    let sum = 0;
    const selection: string = this.criteria.gender;

    switch (selection) {
      case  'All':
        this.chartsModel.age.males.map((g) => {
          sum += g;
        });
        this.chartsModel.age.females.map((g) => {
          sum += g;
        });
        break;
      case 'None':
        sum = 0;
        break;
      case 'Male':
        this.chartsModel.age.males.map((g) => {
          sum += g;
        });
        break;
      case 'Female':
        this.chartsModel.age.females.map((g) => {
          sum += g;
        });
        break;
    }
    return sum;

  }

  getDescription(ageTotal, emotionTotal, genderTotal) {
    let str = '';
    if (this.criteria.gender != 'None') {
      str += 'Gender (' + genderTotal + '), ';
    }
    if (this.criteria.emotion != 'None') {
      str += 'Emotion (' + emotionTotal + '), ';
    }

    if (this.criteria.ages != 'None') {
      str += 'Age (' + (ageTotal || 'Not detected') + '), ';
    }

    str += ' - Total people detected in frame: ' + this.people.length;


    this.summaryDescription = str;
  }

  onCameraSelected() {
    //this.selectedCamera = camera;
    // this.zone.run(() => {
    //   this.getRandomChartData();
    //this.applyCriteria();
    // });

    this.getMonitorFrames();

  }

  getRandomNumber() {

    return Math.floor(Math.random() * (15 - 0 + 1));

  }

  ngOnDestroy()
    :
    void {
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
