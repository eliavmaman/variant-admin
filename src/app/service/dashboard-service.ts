import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import * as $ from 'jquery';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {

  }

  herokuUrl = 'https://variant-ai-server.herokuapp.com';
  local = "http://localhost:3000";


  getDetedctions(from: any, to: any) {
    this.herokuUrl = this.local;
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

  getAllMonitors() {
    if (localStorage.getItem('shinobi') != null) {
      const shinobiData: any = JSON.parse(localStorage.getItem('shinobi'));
      return this.http.get('//51.15.77.204/' + shinobiData.auth_token + '/monitor/' + shinobiData.ke);
    }

  }

  cleanMonitorObjectForDatabase(dirtyMonitor: any, isUpdate?: boolean) {
    var cleanMonitor = {}
    var acceptedFields = ['mid', 'ke', 'name', 'shto', 'shfr', 'details', 'type', 'ext', 'protocol', 'host', 'path', 'port', 'fps', 'mode', 'width', 'height']
    Object.keys(dirtyMonitor).forEach(function (key) {
      if (acceptedFields.indexOf(key) > -1) {
        if (!(isUpdate && key == 'details')) cleanMonitor[key] = isUpdate ? dirtyMonitor[key].toString() : dirtyMonitor[key];
      }
    })
    return cleanMonitor
  }

  updateMonitor(monitor: any) {
    const shinobiData: any = JSON.parse(localStorage.getItem('shinobi'));
    let cleanMonitor: any = this.cleanMonitorObjectForDatabase(monitor, true)
    cleanMonitor.details = monitor.details;
    return this.http.post('//51.15.77.204/' + shinobiData.auth_token + '/configureMonitor/' + shinobiData.ke + '/' + monitor.mid, {data: JSON.stringify(cleanMonitor)});
  }

  createMonitor(monitor: any) {
    var defaultValues = {
      "mode": "start",
      "name": "Some Stream",
      "type": "h264",
      "protocol": "rtsp",
      "host": "",
      "port": "",
      "path": "",
      "ext": "mp4",
      "fps": "1",
      "width": "640",
      "height": "480",
      "details": {
        "fatal_max": "0",
        "notes": "",
        "dir": "",
        "auto_host_enable": "1",
        "auto_host": "",
        "rtsp_transport": "tcp",
        "muser": "",
        "mpass": "",
        "port_force": "0",
        "aduration": "1000000",
        "probesize": "1000000",
        "stream_loop": "0",
        "sfps": "",
        "accelerator": "0",
        "hwaccel": "auto",
        "hwaccel_vcodec": "",
        "hwaccel_device": "",
        "stream_type": "mp4",
        "stream_flv_type": "ws",
        "stream_mjpeg_clients": "",
        "stream_vcodec": "copy",
        "stream_acodec": "no",
        "hls_time": "2",
        "preset_stream": "ultrafast",
        "hls_list_size": "3",
        "signal_check": "10",
        "signal_check_log": "0",
        "stream_quality": "15",
        "stream_fps": "2",
        "stream_scale_x": "",
        "stream_scale_y": "",
        "rotate_stream": "no",
        "svf": "",
        "rtmp_vcodec": "h264",
        "rtmp_acodec": "aac",
        "stream_timestamp": "0",
        "stream_timestamp_font": "",
        "stream_timestamp_font_size": "",
        "stream_timestamp_color": "",
        "stream_timestamp_box_color": "",
        "stream_timestamp_x": "",
        "stream_timestamp_y": "",
        "stream_watermark": "0",
        "stream_watermark_location": "",
        "stream_watermark_position": "tr",
        "snap": "0",
        "snap_fps": "",
        "snap_scale_x": "",
        "snap_scale_y": "",
        "snap_vf": "",
        "rawh264": "0",
        "rawh264_vcodec": "copy",
        "rawh264_acodec": "",
        "rawh264_fps": "",
        "rawh264_scale_x": "",
        "rawh264_scale_y": "",
        "rawh264_crf": "",
        "rawh264_vf": "",
        "vcodec": "copy",
        "crf": "1",
        "preset_record": "",
        "acodec": "no",
        "dqf": "0",
        "cutoff": "15",
        "rotate_record": "no",
        "vf": "",
        "timestamp": "0",
        "timestamp_font": "",
        "timestamp_font_size": "10",
        "timestamp_color": "white",
        "timestamp_box_color": "0x00000000@1",
        "timestamp_x": "(w-tw)/2",
        "timestamp_y": "0",
        "watermark": "0",
        "watermark_location": "",
        "watermark_position": "tr",
        "cust_input": "",
        "cust_snap": "",
        "cust_rawh264": "",
        "cust_detect": "",
        "cust_stream": "",
        "cust_stream_server": "",
        "cust_record": "",
        "custom_output": "",
        "detector": "0",
        "detector_pam": "1",
        "detector_webhook": "0",
        "detector_webhook_url": "",
        "detector_command_enable": "0",
        "detector_command": "",
        "detector_command_timeout": "",
        "detector_lock_timeout": "",
        "detector_save": "0",
        "detector_frame_save": "0",
        "detector_mail": "0",
        "detector_mail_timeout": "",
        "detector_record_method": "sip",
        "detector_trigger": "1",
        "detector_trigger_record_fps": "",
        "detector_timeout": "10",
        "watchdog_reset": "0",
        "detector_delete_motionless_videos": "0",
        "detector_send_frames": "1",
        "detector_region_of_interest": "0",
        "detector_fps": "1",
        "detector_scale_x": "640",
        "detector_scale_y": "480",
        "detector_use_motion": "1",
        "detector_use_detect_object": "0",
        "detector_frame": "0",
        "detector_sensitivity": "",
        "cords": "[]",
        "detector_buffer_vcodec": "auto",
        "detector_buffer_fps": "",
        "detector_buffer_hls_time": "",
        "detector_buffer_hls_list_size": "",
        "detector_buffer_start_number": "",
        "detector_buffer_live_start_index": "",
        "detector_lisence_plate": "0",
        "detector_lisence_plate_country": "us",
        "detector_notrigger": "0",
        "detector_notrigger_mail": "0",
        "detector_notrigger_timeout": "",
        "control": "0",
        "control_base_url": "",
        "control_stop": "0",
        "control_url_stop_timeout": "",
        "control_url_center": "",
        "control_url_left": "",
        "control_url_left_stop": "",
        "control_url_right": "",
        "control_url_right_stop": "",
        "control_url_up": "",
        "control_url_up_stop": "",
        "control_url_down": "",
        "control_url_down_stop": "",
        "control_url_enable_nv": "",
        "control_url_disable_nv": "",
        "control_url_zoom_out": "",
        "control_url_zoom_out_stop": "",
        "control_url_zoom_in": "",
        "control_url_zoom_in_stop": "",
        "tv_channel": "0",
        "groups": "[]",
        "loglevel": "warning",
        "sqllog": "0",
        "detector_cascades": ""
      },
      "shto": "[]",
      "shfr": "[]"
    }
    const shinobiData: any = JSON.parse(localStorage.getItem('shinobi'));
    var url = '//51.15.77.204/' + shinobiData.auth_token + '/configureMonitor/' + shinobiData.ke + '/' + monitor.mid
    monitor.details = JSON.stringify(Object.assign(defaultValues.details, monitor.details))
    var newMonitor = Object.assign(defaultValues, monitor)
    return this.http.post(url, {data: JSON.stringify(newMonitor)});
  }

  deteleMonitor(monitor){
    const shinobiData: any = JSON.parse(localStorage.getItem('shinobi'));
    let cleanMonitor: any = this.cleanMonitorObjectForDatabase(monitor, true)
    cleanMonitor.details = JSON.stringify(monitor.details);
    cleanMonitor.details = cleanMonitor.details.slice(1, -1);
    delete cleanMonitor.protocol;
    delete cleanMonitor.ke;
    return this.http.post('//51.15.77.204/' + shinobiData.auth_token + '/configureMonitor/' + shinobiData.ke + '/' + monitor.mid+'/delete', {data: cleanMonitor});
  }

}
