import {Component, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {Input} from "@angular/core";
import {ViewDimensions} from "@swimlane/ngx-charts";

@Component({
  selector: 'ngx-d3-bar',
  template: `
    <ngx-charts-bar-vertical
      [scheme]="colorScheme"
      [results]="results"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
    >
    </ngx-charts-bar-vertical>
  `,
})
export class D3BarComponent implements OnDestroy {
  @Input() dims: ViewDimensions;

  results = [
    {name: '0-15', value: 10},
    {name: '16-19', value: 0},
    {name: '20-30', value: 2},
    {name: '30-40', value: 15},
    {name: '40-50', value: 1},
    {name: '50+', value: 0},
  ];
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  xAxisLabel = 'Country';
  yAxisLabel = 'Population';
  colorScheme: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
