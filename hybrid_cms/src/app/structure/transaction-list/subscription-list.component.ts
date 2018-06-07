import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
// import { MessageService } from './../../message.service';
import { Observable } from 'rxjs/Observable';
import { DaterangePickerComponent, DaterangepickerConfig } from 'ng2-daterangepicker';
import { stagger } from '@angular/animations/src/animation_metadata';
import { setTimeout } from 'timers';

declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var moment: any;

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  resDataSub = [];
  rdataSub = [];
  daterange: any = {};
  singleDate: any;
  array_of_date = [];
  sort_array_of_date = [];
  calendar_start = "";
  calendar_end = "";
  private dataTable:any;
  handleTimer: Observable<any>;
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  options: any = {
    locale: { format: 'MM-DD-YYYY' },
    alwaysShowCalendars: false,
  };

  constructor(private daterangepickerOptions: DaterangepickerConfig,
    private commonService: CommonService) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'MM-DD-YYYY' },
      alwaysShowCalendars: false,
      ranges: {
        'Yesterday': [moment().add(-1, 'days')],
        'Last Week': [moment().subtract(1, 'week')],
        'Last Month': [moment().subtract(1, 'month'), moment()]
        // 'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        // 'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        // 'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      }
    };
    this.singleDate = Date.now();    
    this.handleTimer = Observable.timer(1000);
  }

  ngOnInit() {
    $("#mySidenav").css('display','none');
    this.loadallsub();
  }
  ngAfterViewInit(): void {
    // 2018-2-16
    // const a = new Date();
    // const thisYear = (new Date()).getFullYear();
    // const start = new Date('1/1/' + thisYear);
    // const defaultStart = moment(start.valueOf());

    // this.picker.datePicker.setStartDate(defaultStart);
    // this.picker.datePicker.setEndDate(Date.now());
  }

  ngOnDestroy(): void {
    // if spinner isActive then
    // console.log('OnDestroy')
    // this.dataTable.destroy();
    // this.messageService.setSpinnerActive(false);
  }
  /**
   * Method to init subsctiption datatable jquery
   */
  private dtSubsInit(): void {
    const buttonCommon = {
      exportOptions: {
        format: {
          body: function (data, row, column, node) {
            // console.log(data);
            return data;
          }
        }
      }
    }
    const handleDelay = Observable.timer(300);
    handleDelay.subscribe(() => {
      this.dataTable = $('#SubscriptionDatatable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
          $.extend(true, {}, buttonCommon, {
            extend: 'excel',
            text: '<i class="icmn-file-text2"></i>  Generate Report',
            title: 'Subscription Details',
            className: 'btn btn-md btn-excel',
          })
        ]
      });
    })
  }
  /**
   * API Call to load all subsctiption data
   */
  private loadallsub(): void {

    this.handleTimer.subscribe(() => {
      NProgress.start();
    })

    if (this.commonService.subscriptionGetter() === undefined) {

      // this.messageService.setSpinnerActive({
      //   active: true,
      //   text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
      // })
     
      this.commonService.getData('getSubscriptionData').subscribe(res => {
        res = JSON.parse(res);
        if (res.status === 1 && res.data) {
          
          let todayDate = new Date();          

          todayDate.setHours(0);
          todayDate.setMinutes(0);
          todayDate.setSeconds(0);
          todayDate = new Date(todayDate.valueOf() - 30*24*60*60*1000);

          res.data.forEach((d) => {
            if(todayDate.valueOf() <= moment(d['timestamp']).valueOf()){
              this.rdataSub.push(d);
            }
          });

          this.resDataSub = res.data;

          this.commonService.subscrptionSetter(res.data);

          setTimeout(()=>{
            let pickerDate = new Date();
            this.picker.datePicker.setStartDate(moment(pickerDate.valueOf() - 1000*60*60*24*30));
            this.picker.datePicker.setEndDate(moment(pickerDate.valueOf()));  
          }, 300);

          this.handleTimer.subscribe(() => {
            NProgress.done()
          });

        } else {
          this.rdataSub = [];
          this.handleTimer.subscribe(() => {
            NProgress.done()
          })
        }
        // call datatable init
        this.dtSubsInit();
        // this.messageService.setSpinnerActive(false);

      });
    } else {
      // call datatable init      
      let resData = this.commonService.subscriptionGetter();

      let todayDate = new Date();               
      todayDate.setHours(0);
      todayDate.setMinutes(0);
      todayDate.setSeconds(0);
      todayDate = new Date(todayDate.valueOf() - 30*24*60*60*1000);
      
      
      resData.forEach((d) => {
        if(todayDate.valueOf() <= moment(d['timestamp']).valueOf()){
          this.rdataSub.push(d);
        }
      });

      setTimeout(() => {
        let pickerDate = new Date();
        this.picker.datePicker.setStartDate(moment(pickerDate.valueOf() - 1000*60*60*24*30));
        this.picker.datePicker.setEndDate(moment(pickerDate.valueOf()));  
      }, 300);

      this.dtSubsInit();      
      this.resDataSub = resData;
      
      
      this.handleTimer.subscribe(() => {
        NProgress.done()
      })

    
    }
  }
  /**
  * Method datepicker for subscription
  * @param value any
  * @param datepicker any
  */
  public selectedDate_sub(value: any, datepicker?: any) {

    // this is the date the iser selected    
    datepicker.start = value.start;
    datepicker.end = value.end;
    // or manipulate your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    
    this.dataTable.destroy();

    this.rdataSub = [];

    const sd = value.start.startOf('day').valueOf();
    const ed = value.end.endOf('day').valueOf();

    this.resDataSub.forEach((d) => {      
      const checkDate = moment(d['timestamp']).valueOf();
      if(checkDate >= sd && checkDate <= ed)
        this.rdataSub.push(d);      
    });

    this.dtSubsInit();

  }

}
