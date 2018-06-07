import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { CanComponentDeactivate } from './../../can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';

import { ColorPickerService, Rgba } from 'ngx-color-picker';

declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
declare var swal: any;

function matchCorrectSpace() {
  // const hasExclamation = input.value !== this.o_password.value;
  return (input: FormControl) => {
    return /^[^-\s][a-zA-Z0-9_\s-]+.+$/.test(input.value) ? null : {
      matchCorrectSpace: {
        valid: false
      }
    };
  }
}

const spaceCheck = new FormControl('', Validators.compose([Validators.required, matchCorrectSpace()]));

@Component({
  selector: 'admin-setting',
  templateUrl: './admin-setting.component.html',
  styles: []
})

export class AdminSettingComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('basicInformationForm') adminSettingsForm: NgForm;
  @ViewChild('adminSaveBtn') adminSaveBtnRef: ElementRef;

  public asform: FormGroup;
  playstoreUrl: any;
  version: any;
  bundleId: any;
  firebase_id: any;
  rdata: any;
  resData: any;
  rateIosAppId: any;
  rateAndrAppId: any;
  iosVersion: any;
  iosAppId: any;
  andrAppId: any;
  andrVersion: any;
  item: Object = {};
  forceupdate_message: any;
  forceupdateData: any;
  google_analytic_data: any;
  currentAppData: any;
  google_analytic_section_data: any;
  basic_information_data: any;
  google_key: any;
  rstatus: any;
  googleJson: any;
  basic_information_section_data: any;
  is_superadmin: boolean;

  firebase_color : any;
  sound_flag: any;
  expires_value : any;
  expires_type : any; 
  server_key: any;
  firebase_title: any;
  firebase_text: any;
  



  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute, private cpService: ColorPickerService) {

    this.commonService.isAuthorizedRoute();
    this.is_superadmin = false;
    var currentuser = this.commonService.getCurrentUserInfo();
    
    if (currentuser.email == "admin@theappcompany.com") {
      this.is_superadmin = true; 
    }
    this.currentAppData = this.commonService.get_current_app_data();
    // const appData = JSON.parse(localStorage.getItem('currentAppData'));
    console.log(this.currentAppData);
    const appData = this.commonService.get_current_app_data();
    console.log(appData);
    this.google_analytic_data = appData['basicDetail']['google_analytic'];
    this.google_analytic_section_data = JSON.parse(this.google_analytic_data['section_json_data']);

    this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
    this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);

    //  console.log(this.google_analytic_section_data);
    this.asform = this.fb.group({
      playstore_url: ['', ''],
      version: ['', ''],
      bundle_id: ['', ''],
      firebase_id: ['', ''],
      andr_app_id: ['', ''],
      android_version: ['', Validators.compose([])],
      ios_app_id: ['', ''],
      ios_version: ['', Validators.compose([])],
      rate_andr_app_id: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      rate_ios_app_id: ['', Validators.compose([Validators.required, matchCorrectSpace()])],
      google_key: spaceCheck,
      server_key: ['', ''],
      firebase_title: ['', ''],
      firebase_text: ['', ''],
      firebase_color : ['', ''],
      sound_flag: ['', ''],
      expires_value : ['', ''],
      expires_type : ['', ''],
    });

  }
  ngOnInit() {
    this.firebase_color = "#203E78"; 
    this.sound_flag = "default";
    this.expires_value = 2;
    this.expires_type = 1;
    $("#mySidenav").css('display','');
    $(function () {
      $('.message_body').summernote({
        height: 200
        // placeholder: 'write here...'
      });

      $('[data-toggle=tooltip]').tooltip();
    });
    // call api to load admin setting data
    this.getAdminSettingData();
  }
  /**
   * Method to retrive promise appdata
   * @returns Promise<any>
   */
  getCureentAppDataPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      const appData = this.commonService.get_current_app_data();
      if (appData !== null) {
        resolve(appData);
      } else {
        reject();
      }
    })
  }
  /**
   * Method to retrive adminsetting data for current app
   * @returns void
   */
  getAdminSettingData(): void {
    this.getCureentAppDataPromise().then((d) => {
      this.commonService.postData(d, 'getAdminSettingData').subscribe(res => {

        this.resData = JSON.parse(res);
        // console.log(this.resData);
        // if (this.resData[0]['plystore_url'] !== undefined) {
        //   this.playstoreUrl = this.resData[0]['plystore_url'];
        // }

        // this.version = this.resData[0]['version'];
        // this.bundleId = this.resData[0]['bundle_id'];
        if (this.resData.length != 0) {
          
          this.rateIosAppId = this.resData[0]['rate_ios_app_id'];
          this.rateAndrAppId = this.resData[0]['rate_android_app_id'];
          this.iosVersion = this.resData[0]['ios_version'];
          this.iosAppId = this.resData[0]['ios_app_id'];
          this.andrAppId = this.resData[0]['android_app_id'];
          this.andrVersion = this.resData[0]['android_version'];
          if (this.google_analytic_section_data != null) {
            if (this.google_analytic_section_data.hasOwnProperty('google_key')) {
              this.google_key = this.google_analytic_section_data['google_key'];
            }
            if (this.google_analytic_section_data.hasOwnProperty('firebase_id')) {
              this.firebase_id = this.google_analytic_section_data['firebase_id'];
            }
          }
        }
        this.patchValues();
      })
    })
  }
  /**
   * TODO to set asform data after fetch data form api
   * @returns void
   */
  patchValues(): void {
    this.asform.patchValue({
      android_version: this.andrVersion,
      ios_version: this.iosVersion,
      rate_andr_app_id: this.rateAndrAppId,
      rate_ios_app_id: this.rateIosAppId,
      google_key: this.google_key,
      firebase_id: this.firebase_id,
      server_key: this.server_key,
      firebase_title: this.firebase_title,
      firebase_text: this.firebase_text,
      firebase_color : this.firebase_color,
      sound_flag: this.sound_flag,
      expires_value : this.expires_value,
      expires_type : this.expires_type,
    })
  }

  adminSettingSubmit(form: NgForm) {
    this.adminSettingSubmitObserver(form).subscribe(d => {
    }, err => {
    })
  }

  adminSettingSubmitObserver(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      this.adminSaveBtnRef.nativeElement.disabled = true;
      console.log(form);
      this.firebaseOnsubmit();
      this.googleAnalyticOnSubmit(form);
      // const a = JSON.parse(localStorage.getItem("currentAppData"));
      const a = this.commonService.get_current_app_data();
      form.value.app_unique_id = a.id;
      // console.log(form.value);
      console.log(form.value);
      this.commonService.postData(form.value, 'saveAdminSettingData').subscribe(res => {

        // console.log(res);
        this.rdata = JSON.parse(res);
        if (this.rdata['status'] === 1) {
          const success_message = this.rdata['message'];
          NProgress.done();
          $(function () {
            $.notify({
              title: '',
              message: success_message
            }, {
                type: 'success'
              });
          });
          // set form as markaspristine
          observer.next(success_message);
          observer.complete();
          this.asform.markAsPristine();
          this.adminSaveBtnRef.nativeElement.disabled = false;
        } else {
          NProgress.done();
          observer.complete();
          // set form as markaspristine
          this.asform.markAsPristine();
          this.adminSaveBtnRef.nativeElement.disabled = false;
        }
      })
    })
  }

  googleAnalyticOnSubmit(form: NgForm) {

    // console.log(this.google_analytic_section_data['token']);
    // this.googleJson = '{"google_key":"' + form.value.google_key + '","id":"' + this.google_analytic_data['id'] + '","token":"" }';
    // var a = JSON.parse(this.googleJson);
    form.value.id = this.google_analytic_data['id'];

    console.log(form.value);
    this.commonService.postData(form.value, 'googleanalytic').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {

        this.currentAppData['basicDetail']['google_analytic']['section_json_data'] = this.rdata['data']['section_json_data'];
        this.google_analytic_data = this.currentAppData['basicDetail']['google_analytic'];
        this.google_analytic_section_data = JSON.parse(this.basic_information_data['section_json_data']);
        
        localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        const success_message = this.rdata['message'];
      } else {
        const error_message = this.rdata['message'];

      }
    });
  }

  firebaseOnsubmit() {
      // server_key: this.server_key,
      // firebase_title: this.firebase_title,
      // firebase_text: this.firebase_text,
      // firebase_color : this.firebase_color,
      // sound_flag: this.sound_flag,
      // expires_value : this.expires_value,
      // expires_type : this.expires_type,
      let addition = 1;
      if (this.expires_type == 2) {
        addition = addition * 24;
      }
      if (this.expires_type == 3) {
        addition = addition * 24 * 7;
      }
      let hours = this.expires_value * addition;

    const FireBaseBuffer = {
      value: {
        server_key: this.server_key,
        text: this.firebase_text,
        title: this.firebase_title,
        sound: this.sound_flag,
        color: this.firebase_color,
        expires: hours,
      }
    };
    debugger;
    console.log(FireBaseBuffer.value);
    this.commonService.postData(FireBaseBuffer.value, 'sendNotification').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if (this.rstatus == '1') {

        // this.currentAppData['basicDetail']['google_analytic']['section_json_data'] = this.rdata['data']['section_json_data'];
        // this.google_analytic_data = this.currentAppData['basicDetail']['google_analytic'];
        // this.google_analytic_section_data = JSON.parse(this.basic_information_data['section_json_data']);
        
        // localStorage.setItem('currentAppData', JSON.stringify(this.currentAppData));
        // const success_message = this.rdata['message'];
      } else {
        const error_message = this.rdata['message'];

      }
    });
  }



  /**
   * canDeactive method implementation
   * @returns boolean | Promise<boolean> | Observable<boolean>
   */
  canDeactivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.asform.dirty) {
      return new Promise<boolean>((resolve, reject) => {
        swal({
          title: 'You didn`t save!',
          text: 'You have unsaved changes, would you like to save?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn-success',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          closeOnConfirm: true,
          closeOnCancel: true
        }, (isConfirm) => {
          // if accept yes
          if (isConfirm) {
            // console.log(this.biform.dirty);
            if (this.asform.dirty) {
              this.adminSettingSubmitObserver(this.adminSettingsForm).subscribe(d => {
                resolve(true);
              }, err => {
                resolve(false);
              })
            } else {
              resolve(true);
            }
          } else {
            resolve(true);
          }
        });
      });
    } else {
      return true;
    }
  }
  ChangeColorPicker ($event) {
    console.log($event);
    this.firebase_color = $event;
  }

}

