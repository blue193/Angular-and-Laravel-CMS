import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from './../../common.service';

/**
 * interface designed for dicussion  model
 * @version 1.0
 * @author
 */
export interface DicussionRes {

  data: DicussionSubRes[];

}
export interface DicussionSubRes {
  id?: number;
  sender_name: string;
  dicussion: string;
  status: '1' | '2' | '3';
  created_at: string,
  updated_at: string
}
// declare var
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements OnInit {

  @ViewChild('dicussion_scroll')
  private Dicussion_Scroll: ElementRef;

  isAppAssign: boolean;
  private dicussForm: FormGroup;
  private dicussionList: Array<any>;
  private rdata: any;

  constructor(private fb: FormBuilder, private commonService: CommonService, private route: Router) {
    this.dicussForm = this.fb.group({
      dicussion_text: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    $("#mySidenav").css('display','none');
    // fetch dicussion list for new selected app
    this.fetchDicussion();
    // check wheter to show contact us section
    this.showView();
  }

  /**
   * Method to store dicussion
   * @param form (NgForm)
   */
  onSubmit(form: NgForm): void {

    NProgress.start();
    const currentLogin = this.currentUserfetcher();

    const appId = this.appIdFetcher();
    form.value.app_id = appId;
    form.value.email = currentLogin.email;
    form.value.role_id = currentLogin.role_id;

    // console.log(form.value);

    this.commonService.postData(form.value, 'storeDicussion').subscribe(res => {
      this.rdata = JSON.parse(res);
      // console.log(this.rdata);
      const rstatus = this.rdata['data'].status;
      if (rstatus === 1) {

        // this.versionManagementData = this.rdata['data'];
        form.resetForm();
        this.fetchDicussion();

        this.Dicussion_Scroll.nativeElement.scrollTop = this.Dicussion_Scroll.nativeElement.scrollHeight + 120;

        // console.log(this.Dicussion_Scroll.nativeElement.scrollTop);

        const success_message = this.rdata['data'].message;
        $(function () {
          $.notify({
            title: '',
            message: success_message
          }, {
              type: 'success'
            });
        });
        NProgress.done();

      } else {
        const error_message = this.rdata['data'].message;
        $(function () {
          $.notify({
            title: '',
            message: error_message
          }, {
              type: 'danger'
            });
        });
        NProgress.done();
      }

    }, error => {
      this.rdata = JSON.parse(error._body);
      const error_message = this.rdata['data'].message;

      $(function () {
        $.notify({
          title: '',
          message: error_message
        }, {
            type: 'danger'
          });
      });
      NProgress.done();
    });
  }
  /**
   * Method to retrive general dicussion if have any
   * @param
   * @returns void
   */
  fetchDicussion(): void {
    const app = this.appIdFetcher();
    this.commonService.postData({ 'app_id': app }, 'getDicussionByAppID').subscribe(res => {
      const rdata = JSON.parse(res);

      if (rdata.status === 1 && rdata.data instanceof Array) {

        // this.versionManagementData = this.rdata['data'];
        this.dicussionList = rdata.data;
        // console.log(this.dicussionList);

      } else {
        const error_message = rdata.data;
        $.notify({
          title: '',
          message: error_message
        }, {
            type: 'warning'
          });

      }
    }, error => {
      // console.log(error);
    });
  }

  /**
  * Method to retrive current login user data
  */
  private currentUserfetcher() {
    const currentLogin = JSON.parse(localStorage.getItem('currentUser'));
    return currentLogin;
  }
  /**
* Method to retrive current app id
*/
  private appIdFetcher() {
    const appid = JSON.parse(localStorage.getItem('currentAppData'));
    return appid.id;
  }
  /**
   * Method to show/hide contact us view
   */
  showView(): void {
    const app = this.commonService.get_current_app_data();
    if (app && app.hasOwnProperty('app_assign')) {
      if (app.app_assign) {
        this.isAppAssign = app.app_assign;
      } else {
        this.isAppAssign = app.app_assign
      }

    } else {
      // do something if app data not set in storage
    }
  }

}
