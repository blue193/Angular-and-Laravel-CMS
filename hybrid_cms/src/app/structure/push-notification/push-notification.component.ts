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

@Component({
  selector: 'push-notification',
  templateUrl: './push-notification.component.html',
  styles: []
})

export class PushNotificationComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('basicInformationForm') pushNotificationForm: NgForm;
  @ViewChild('saveBtn') saveBtnRef: ElementRef;

  public asform: FormGroup;
  playstoreUrl: any;
  version: any;
  bundleId: any;
  firebase_id: any;
  rdata: any;
  resData: any;
  
  item: Object = {};
  forceupdate_message: any;
  forceupdateData: any;
  
  currentAppData: any;
  basic_information_data: any;
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

    this.basic_information_data = this.currentAppData['basicDetail']['basic_information'];
    this.basic_information_section_data = JSON.parse(this.basic_information_data['section_json_data']);

    //  console.log(this.google_analytic_section_data);
    this.asform = this.fb.group({
      playstore_url: ['', ''],
      version: ['', ''],
      bundle_id: ['', ''],
      firebase_id: ['', ''],
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
   * TODO to set asform data after fetch data form api
   * @returns void
   */
  patchValues(): void {
    this.asform.patchValue({
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

  pushNotificationSubmit(form: NgForm) {
    this.pushNotificationSubmitObserver(form).subscribe(d => {
    }, err => {
    })
  }

  pushNotificationSubmitObserver(form: NgForm) {
    return Observable.create((observer) => {
      NProgress.start();
      this.saveBtnRef.nativeElement.disabled = true;
      console.log(form);
      
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

      console.log(FireBaseBuffer.value);
      this.commonService.postData(FireBaseBuffer.value, 'sendNotification').subscribe(res => {
        this.rdata = JSON.parse(res);
        this.rstatus = this.rdata['status'];
        NProgress.done();
        if (this.rstatus == '1') {

        } else {
          const error_message = this.rdata['message'];
        }
        observer.complete();
        this.asform.markAsPristine();
        this.saveBtnRef.nativeElement.disabled = false;
      });
    
      // const a = JSON.parse(localStorage.getItem("currentAppData"));
      const a = this.commonService.get_current_app_data();
      form.value.app_unique_id = a.id;
      // console.log(form.value);
      console.log(form.value);
      
    })
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
              this.pushNotificationSubmitObserver(this.pushNotificationForm).subscribe(d => {
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

