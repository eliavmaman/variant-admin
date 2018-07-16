
import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';
import { AnalyticsService } from '../../../@core/utils/analytics.service';

@Component({
  selector: 'ngx-theme-switcher',
  styleUrls: ['./theme-switcher.component.scss'],
  template: `
    <label class="theme-switch">
      <span class="light">Light</span>
      <div class="switch">
        <input type="checkbox" [checked]="currentBoolTheme()" (change)="toggleTheme(theme.checked)" #theme>
        <span class="slider"></span>
      </div>
      <span class="cosmic">Cosmic</span>
    </label>
  `,
})
export class ThemeSwitcherComponent implements OnInit {
  theme: NbJSThemeOptions;

  constructor(private themeService: NbThemeService, private analyticsService: AnalyticsService) {
  }

  ngOnInit() {
    this.themeService.getJsTheme()
      .subscribe((theme: NbJSThemeOptions) => this.theme = theme);
  }

  toggleTheme(theme: boolean) {
    const boolTheme = this.boolToTheme(theme);
    this.themeService.changeTheme(boolTheme);
    this.analyticsService.trackEvent('switchTheme');
  }

  currentBoolTheme() {
    return this.themeToBool(this.theme);
  }

  private themeToBool(theme: NbJSThemeOptions) {
    return theme.name === 'cosmic';
  }

  private boolToTheme(theme: boolean) {
    return theme ? 'cosmic' : 'default';
  }
}

// import { Component, Input, ViewChild } from '@angular/core';
// import { NbPopoverDirective } from '@nebular/theme';
// import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';
//
// import { ThemeSwitcherListComponent } from './themes-switcher-list/themes-switcher-list.component';
//
// @Component({
//   selector: 'ngx-theme-switcher',
//   templateUrl: './theme-switcher.component.html',
//   styleUrls: ['./theme-switcher.component.scss'],
// })
// export class ThemeSwitcherComponent {
//   @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
//
//   @Input() showTitle: boolean = true;
//
//   switcherListComponent = ThemeSwitcherListComponent;
//   theme: NbJSThemeOptions;
// }
