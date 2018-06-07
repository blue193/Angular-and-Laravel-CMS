import { Component, OnInit, EventEmitter, Input, Output, OnDestroy, ViewChild, } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, NgForm, NgModel } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerService, Rgba } from 'ngx-color-picker';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import for subscription
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from './../../../message.service';

import { CommonService } from './../../../common.service';
import { SharedService } from './../../../shared.service';
import { MasonryLayoutDirective } from 'ngx-masonry-layout/components';
import {AppStyleConfigComponent} from '../../apps/app-style-config.component';
import { Jsonp } from '@angular/http/src/http';

import { config, defaultI18n, defaultOptions } from "./formbuilder/config";
import { FormBuilderCreateor } from "./formbuilder/form-builder";
import I18N from "./formbuilder/mi18n";
import * as $ from 'jquery';

// declare var $: any;
// declare var jQuery: any;

declare var NProgress: any;
declare var swal: any;

function initJq() {
  (function ($) {
    (<any>$.fn).formBuilder = function (options) {
      if (!options) {
        options = {};
      }
      let elems = this;
      let {i18n, ...opts} = $.extend({}, defaultOptions, options, true);
      (<any>config).opts = opts;
      let i18nOpts = $.extend({}, defaultI18n, i18n, true);
      let instance = {
        actions: {
          getData: null,
          setData: null,
          save: null,
          showData: null,
          setLang: null,  
          addField: null,
          removeField: null,
          clearFields: null
        },
        get formData() {
          return instance.actions.getData('json');
        },

        promise: new Promise(function (resolve, reject) {
          new I18N().init(i18nOpts).then(() => {
                elems.each(i => {
                  let formBuilder = new FormBuilderCreateor().getFormBuilder(opts, elems[i]);
                  
                  $(elems[i]).data('formBuilder', formBuilder);
                  instance.actions = formBuilder.actions;
                  console.log('formbuilder=>',formBuilder);
                });
         
            delete instance.promise;
            resolve(instance);
          }).catch(console.error);
        })

      };

      return instance;
    };
  })(jQuery);
}

@Component({
    selector: 'app-menu-type-contact',
    templateUrl: './menu-type-contact.component.html',
    styleUrls: [],
 
})

export class MenuTypeContactComponent implements OnInit, OnDestroy{
    formBuilder: any;
    @Input('menuTypeSubContactCssJsonData') menuSubCssJsonData: any;

    @Output('childContactFormData') contactFormOutgoingData = new EventEmitter<any>();

    @Input('menuTypePhotoSlugId') menuTypeMenuSlugId: any;

    @ViewChild(AppStyleConfigComponent) appStyleConfigComponent;

    
    
    closeResult: any;

    public typeMenuform = {
      contact_form_json: '',
    };

    private dirtyFormBool: boolean;
    private errorFormBool: boolean;
    fileList: FileList;
    rdata: any;
    rstatus: any;
    subMenuCssJsonData: any;
    getMenuTypeSubCssData: any;
    // declare subscription
    msgMenuJsonSubscrption: Subscription;
    cssJsonSubRes: any;
    formData_text: any;
    constructor(private modalService: NgbModal,
    private commonService: CommonService,
    private fb: FormBuilder,
    private http: Http,
    private sharedService: SharedService,
    private msgMenuCssJson: MessageService) {
        
    }

    
    

    ngOnInit() {

      initJq();

      this.msgMenuJsonSubscrption = this.msgMenuCssJson.getCssJsonData().subscribe(res => {
        this.cssJsonSubRes = res.data;
        this.todoAfterCssJson();
      });

      let subFormData: FormData = new FormData();
        subFormData.append('contact_form_json', this.typeMenuform.contact_form_json);
        this.contactFormOutgoingData.emit(subFormData);
   
      // var formData = JSON.stringify([
      //   {
      //     "type": "text",
      //     "label": "Input Label",
      //     "name": "text-1519535610557",
      //     "subtype": "text"
      //   },
      //   {
      //     "type": "text",
      //     "label": "Input Label",
      //     "name": "text-1519535610566",
      //     "subtype": "text"
      //   },
      //   {
      //     "type": "autocomplete",
      //     "label": "autocomplete",
      //     "className": "form-control",
      //     "name": "autocomplete-1519535635410",
      //     "values": [
      //       {
      //         "label": "Option 1",
      //         "value": "option-1"
      //       },
      //       {
      //         "label": "Option 2",
      //         "value": "option-2"
      //       },
      //       {
      //         "label": "Option 3",
      //         "value": "option-3"
      //       }
      //     ]
      //   }
      // ]);
      // var formData = $('input#hidden-info').val();
     
      // var formData_text = "[\n\t{\n\t\t\"type\": \"autocomplete\",\n\t\t\"label\": \"autocomplete\",\n\t\t\"className\": \"form-control\",\n\t\t\"name\": \"autocomplete-1519689963285\",\n\t\t\"values\": [\n\t\t\t{\n\t\t\t\t\"label\": \"Option 1\",\n\t\t\t\t\"value\": \"option-1\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"label\": \"Option 2\",\n\t\t\t\t\"value\": \"option-2\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"label\": \"Option 3\",\n\t\t\t\t\"value\": \"option-3\"\n\t\t\t}\n\t\t]\n\t},\n\t{\n\t\t\"type\": \"button\",\n\t\t\"label\": \"button\",\n\t\t\"subtype\": \"button\",\n\t\t\"className\": \"btn-default btn\",\n\t\t\"name\": \"button-1519689964397\",\n\t\t\"style\": \"default\"\n\t}\n]";
 
      var option = {
        formData: this.formData_text,
        dataType: 'json'
      }
      this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder(option);
      
    }

    ngOnDestroy(): void {
      this.msgMenuJsonSubscrption.unsubscribe();
    }

    todoAfterCssJson(): void {
      if (this.cssJsonSubRes) {
          this.typeMenuform = this.cssJsonSubRes;
          console.log('dkdkdkdkdkdkdkdkdkd--->',this.typeMenuform);
          $('input#hidden-info').val(this.typeMenuform.contact_form_json);
          this.formData_text = this.typeMenuform.contact_form_json;
      }
      else {
          
      }
    }

    viewSavedInfo(val: any) {
      
      let tmpJson =  $('input#hidden-info').val();
      $('input#hidden-info').val(val);
      
    }

    sendMenuTypeContactFormData( data: any, childForm: NgForm ) {
      
      let subFormData: FormData = new FormData();
      console.log('ddddddddddddddd=>',this.typeMenuform.contact_form_json);
      subFormData.append('contact_form_json', this.typeMenuform.contact_form_json);
      // console.log(subFormData);
      this.contactFormOutgoingData.emit(subFormData);
  }

  
    title = 'app';
}




































/**
     * In case of using Modal 
     * use openModal function.
     */
    // openModal(content) {
    //   this.modalService.open(content);
    //   setTimeout(() => {
    //     initJq();
    //     // var formData = JSON.stringify([{ type: "text", label: "Input Label" },{ type: "text", label: "Input Label" }]);
    //     var formData = JSON.stringify([
    //       {
    //         "type": "text",
    //         "label": "Input Label",
    //         "name": "text-1519535610557",
    //         "subtype": "text"
    //       },
    //       {
    //         "type": "text",
    //         "label": "Input Label",
    //         "name": "text-1519535610566",
    //         "subtype": "text"
    //       },
    //       {
    //         "type": "autocomplete",
    //         "label": "autocomplete",
    //         "className": "form-control",
    //         "name": "autocomplete-1519535635410",
    //         "values": [
    //           {
    //             "label": "Option 1",
    //             "value": "option-1"
    //           },
    //           {
    //             "label": "Option 2",
    //             "value": "option-2"
    //           },
    //           {
    //             "label": "Option 3",
    //             "value": "option-3"
    //           }
    //         ]
    //       }
    //     ]);
    //     this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder({formData});
    //     // jQuery(function($) {
    //     //   var $fbTemplate1 = $(document.getElementById("stage1"));
    //     //   var formData = JSON.stringify([{ type: "text", label: "Input Label" },{ type: "text", label: "Input Label" }]);
    //     //   var formBuilder = $fbTemplate1.formBuilder({ formData });
    //     // });
    //   }, 0);
    // }