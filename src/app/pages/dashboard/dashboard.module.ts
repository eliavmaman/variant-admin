import {NgModule} from '@angular/core';

import {NgxEchartsModule} from 'ngx-echarts';

import {ThemeModule} from '../../@theme/theme.module';
import {DashboardComponent} from './dashboard.component';
import {StatusCardComponent} from './status-card/status-card.component';
import {ContactsComponent} from './contacts/contacts.component';
import {RoomsComponent} from './rooms/rooms.component';
import {RoomSelectorComponent} from './rooms/room-selector/room-selector.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {TemperatureDraggerComponent} from './temperature/temperature-dragger/temperature-dragger.component';
import {TeamComponent} from './team/team.component';
import {KittenComponent} from './kitten/kitten.component';
import {SecurityCamerasComponent} from './security-cameras/security-cameras.component';
import {ElectricityComponent} from './electricity/electricity.component';
import {ElectricityChartComponent} from './electricity/electricity-chart/electricity-chart.component';
import {WeatherComponent} from './weather/weather.component';
import {SolarComponent} from './solar/solar.component';
import {PlayerComponent} from './rooms/player/player.component';
import {TrafficComponent} from './traffic/traffic.component';
import {TrafficChartComponent} from './traffic/traffic-chart.component';
import {ChartsModule} from '../charts/charts.module';
import {Daterangepicker} from "ng2-daterangepicker";
import {MultiselectDropdownModule} from "angular-2-dropdown-multiselect";
import {MonitorsComponent} from "./monitors/monitors.component";
import {CreateMonitorComponent} from "./monitors/create/create-monitor.component";
import {ModalModule} from "ngx-bootstrap";
import {EditMonitorComponent} from "./monitors/edit/edit-monitor.component";
import {ConfirmationModalComponent} from "./confirm/confirmation-modal.component";


@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    ChartsModule,
    Daterangepicker,
    MultiselectDropdownModule,
    ModalModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
    MonitorsComponent,
    CreateMonitorComponent,
    EditMonitorComponent,
    ConfirmationModalComponent
  ],
  entryComponents: [ConfirmationModalComponent]
})
export class DashboardModule {
}
