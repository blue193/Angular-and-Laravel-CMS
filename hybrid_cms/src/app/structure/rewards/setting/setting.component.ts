import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { CommonService } from './../../../common.service';
import { CheckloginService } from './../../../checklogin.service';
import { Observable } from 'rxjs/Observable';

import { ColorPickerService, Rgba } from 'ngx-color-picker';

import { S3Service } from './../../../s3.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
	selector: 'app-reward-settings',
	templateUrl: './setting.component.html',
	styleUrls: ['./setting.component.css']
})
export class RewardSettingComponent implements OnInit {
	@ViewChild('app_background_image') app_background_image_ref: ElementRef;
	form: FormGroup;
	editId = '';
	rdata;
	postCount: any;
	postBusy : any;
	PreSettingData = {};
	SettingData = {
			Punch_Card_System: {
				User_Punch_Card_System: {
					Type: "1",
				},
				Style: {
					Type: "1",
					Fill_Color: "#000000",
					Outline_Color: "#000000",
				}
			},
			Points_Per_Check_In: {
				Minimum: 1,
				Maximum: 10,
				Increment: 1,
			},
			Rewards_Card: {
				Background_Color: "#000000",
				Background_Image: "",
				Header_Image: "",
				Icon_Image: "",
				Points_Punch_Text: {
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Points_Card_Check_In_Name: {
					Singular:"",
					Plural:"",
				},
				Punch_Card_Check_In_Name: {
					Singular:"",
					Plural:"",
				},
				Punch_Card_Message: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Point_Card_Message: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Rewards_Earned_Message: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
			},
			Rewards_List: {
				Background_Color: "#000000",
				Total_Points: {
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
					Punch_Message_Singular:"",
					Punch_Message_Plural:"",
					Point_Message_Singular:"",
					Point_Message_Plural:"",
				},
				Total_Remaining_Balance: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Reward_Title: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Reward_Description: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Reward_Cost: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Line_Separator: {
					Color: "#000000",
					Thickness: 1,
				},
				Arrow: {
					Color: "#000000",
				},
			},
			Redemption_History: {
				Background_Color: "#000000",
				Header_Text: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				Reward_Title: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Reward_Description: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Reward_Cost: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Redeem_Date: {
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Line_Separator: {
					Color: "#000000",
					Thickness:"",
				}
			},
			Login_Register: {
				Icon_Image: "",
				Background_Color: "#000000",
				Title_Login: {
					Text: "",
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Title_Register: {
					Text: "",
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Title_Reset_Password: {
					Text: "",
					Font_size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				Login_Button: {
					Background_Color : "#000000",
				},
				Register_Button: {
					Background_Color : "#000000",
				},
				Reset_Password_Button: {
					Background_Color : "#000000",
				},
				New_Account_Button: {
					Background_Color : "#000000",
				},
				Back_To_Login_Button: {
					Background_Color : "#000000",
				},
				New_Member_Email_Subject: {
					Text : "",
				},
				New_Member_Email_Message: {
					Text : "",
				},
			},
			Settings: {
				Gear_Icon: {
					Color: "#000000",
				},
				Background_Color: "#000000",
				Redemption_History_Button: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				Logout_Button: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
			},
			Messages: {		
				CASHIER: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				CHECKIN_SUCCESSFUL: {
					Singular: "",
					Plural: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				CHECKIN_FAILED: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				REDEEM_SUCCESSFUL: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
				REDEEM_FAILED: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					 Font:"Arial",
				},
			},
			Buttons: {			
				CHECK_IN: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				REDEEM: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				REDEEM_UNSELECTABLE: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				REDEEM_REWARDS_EARNED: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				CONTINUE: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				BACK: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
				TRY_AGAIN: {
					Text: "",
					Font_Size: 10,
					Color: "#000000",
					Background_Color: "#000000",
					 Font:"Arial",
				},
			},

		};

	public tempColor = {
		'value': '#ff0000'
	};

	public tmpSelect = 2;
	public appId : any;
	public fontFamilyData = [];

	


	constructor(
		private commonService: CommonService,
		private fb: FormBuilder,
		private router: Router,
		private s3Service: S3Service,
		private cpService: ColorPickerService,
		private linkValue: ActivatedRoute) {
		this.commonService.isAuthorizedRoute();	
		this.editId = this.linkValue.snapshot.params.id;
		this.form = this.fb.group({
			username: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required])],
			first_name: '',
			last_name: '',
			point: 0
		});
		NProgress.start();
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		this.commonService.postData({app_id: this.appId}, 'getReviewSetting').subscribe(res => {
			this.rdata = JSON.parse(res);
			if (this.rdata.data.length != 0) {
				this.SettingData = JSON.parse(this.rdata.data[0].json);
			}
			this.initSetting();
			NProgress.done();
		}, error => {
			NProgress.done();
		});
		this.fontFamilyData = [];
        this.commonService.getData('getFontData').subscribe(res => {
            this.fontFamilyData = JSON.parse(res);
		})
		
		this.PreSettingData = this.SettingData;
		console.log(this.PreSettingData);
		debugger;
	}

	// let blob = $('.header-icon-dropify').converter2File();
    //                 var b: any = blob;
    //                 b.lastModifiedDate = new Date();
    //                 b.name = "app.png";
    //                 let blob_file = <File>blob;
    //                 if (blob_file != null) {
    //                     this.headerImgDataMain.append('headerMainImg', blob_file);
    //                 }

	initSetting() {

		const drBackImage = $('#app_background_image').dropify({
			defaultFile: this.SettingData['Rewards_Card']['Background_Image'],
			messages: {
				'default': 'Drag and drop a file here or click',
				'replace': 'Drag and drop or click to replace',
				'remove': 'Remove',
				'error': ''
			},
			error: {
				'fileSize': 'The file size is too big ({{ value }} max).',
				'minWidth': 'The image width is too small ({{ value }}px min).',
				'maxWidth': 'The image width is too big ({{ value }}px max).',
				'minHeight': 'The image height is too small ({{ value }}px min).',
				'maxHeight': 'The image height is too big ({{ value }}px max).',
				'imageFormat': 'The image format is not allowed ({{ value }} only).'
			},
			tpl: {
				wrap: '<div class="dropify-wrapper"></div>',
				loader: '<div class="dropify-loader"></div>',
				message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
				preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
				filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
				clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
				errorLine: '<p class="dropify-error">{{ error }}</p>',
				errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
			}
		});

		const drHeaderImage = $('#app_header_image').dropify({
			defaultFile: this.SettingData['Rewards_Card']['Header_Image'],
			messages: {
				'default': 'Drag and drop a file here or click',
				'replace': 'Drag and drop or click to replace',
				'remove': 'Remove',
				'error': ''
			},
			error: {
				'fileSize': 'The file size is too big ({{ value }} max).',
				'minWidth': 'The image width is too small ({{ value }}px min).',
				'maxWidth': 'The image width is too big ({{ value }}px max).',
				'minHeight': 'The image height is too small ({{ value }}px min).',
				'maxHeight': 'The image height is too big ({{ value }}px max).',
				'imageFormat': 'The image format is not allowed ({{ value }} only).'
			},
			tpl: {
				wrap: '<div class="dropify-wrapper"></div>',
				loader: '<div class="dropify-loader"></div>',
				message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
				preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
				filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
				clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
				errorLine: '<p class="dropify-error">{{ error }}</p>',
				errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
			}
		});

		const drIconImage = $('#app_icon_image').dropify({
			defaultFile: this.SettingData['Rewards_Card']['Icon_Image'],
			messages: {
				'default': 'Drag and drop a file here or click',
				'replace': 'Drag and drop or click to replace',
				'remove': 'Remove',
				'error': ''
			},
			error: {
				'fileSize': 'The file size is too big ({{ value }} max).',
				'minWidth': 'The image width is too small ({{ value }}px min).',
				'maxWidth': 'The image width is too big ({{ value }}px max).',
				'minHeight': 'The image height is too small ({{ value }}px min).',
				'maxHeight': 'The image height is too big ({{ value }}px max).',
				'imageFormat': 'The image format is not allowed ({{ value }} only).'
			},
			tpl: {
				wrap: '<div class="dropify-wrapper"></div>',
				loader: '<div class="dropify-loader"></div>',
				message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
				preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
				filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
				clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
				errorLine: '<p class="dropify-error">{{ error }}</p>',
				errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
			}
		});

		const drLoginIconImage = $('#app_login_icon_image').dropify({
			defaultFile: this.SettingData['Login_Register']['Icon_Image'],
			messages: {
				'default': 'Drag and drop a file here or click',
				'replace': 'Drag and drop or click to replace',
				'remove': 'Remove',
				'error': ''
			},
			error: {
				'fileSize': 'The file size is too big ({{ value }} max).',
				'minWidth': 'The image width is too small ({{ value }}px min).',
				'maxWidth': 'The image width is too big ({{ value }}px max).',
				'minHeight': 'The image height is too small ({{ value }}px min).',
				'maxHeight': 'The image height is too big ({{ value }}px max).',
				'imageFormat': 'The image format is not allowed ({{ value }} only).'
			},
			tpl: {
				wrap: '<div class="dropify-wrapper"></div>',
				loader: '<div class="dropify-loader"></div>',
				message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
				preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
				filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
				clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
				errorLine: '<p class="dropify-error">{{ error }}</p>',
				errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
			}
		});
	}
	ngOnInit() {
		
		// background-image-dropify
		// app_background_image

		//init image cropping

		let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
        if (typeof($('#preview').html()) == 'undefined') {
        	$('body').append(bottom_html);
		}
		
	}
	
	onSubmit(form: NgForm) {
		this.onSubmitObservable(form, false)
			.subscribe();
	}

	onSubmitObservable(form: NgForm, canDeactivate: boolean): Observable<any> {
		return Observable.create((observer) => {
			
		});
	}

	ChangeColorPicker($event, value) {
		console.log($event);
		console.log(value);
		this.splitPropString($event,value);
		
	}

	ChangeTextModel($event, value) {
		debugger;
		console.log($event);
		this.splitPropString($event,value);
	}

	ChangeSelectModel($event, value) {
		console.log($event);
		this.splitPropString($event,value);
	}

	appBackGroundFileChange ($event) {
		$('.background-image-dropify').simpleCropper(256,256);
	}

	appHeaderFileChange ($event) {
		$('.header-image-dropify').simpleCropper(256,256);
	}

	appIconFileChange ($event) {
		$('.icon-image-dropify').simpleCropper(256,256);
	}

	appLoginIconFileChange ($event) {
		$('.login-icon-image-dropify').simpleCropper(256,256);
	}

	splitPropString ($event,value: any) {
		let str: string = String(value);
		let pathArray =  str.split("/");
		if (pathArray.length == 1) {
			this.SettingData[pathArray[0]] = $event
		} else if (pathArray.length == 2) {
			this.SettingData[pathArray[0]][pathArray[1]] = $event
		} else if (pathArray.length == 3) {
			this.SettingData[pathArray[0]][pathArray[1]][pathArray[2]] = $event
		}
	}

	resetAllSettingData() {
		
	}

	postAllSettingData () {
		NProgress.start();
		const self = this;
		self.postCount = 0;
		self.postBusy = false;
		var interval = setInterval(() => {
			
			if ($('#app_background_image')[0].isChanged && self.postCount == 0) {
				if (self.postBusy == true) {
					return;
				}
				self.postBusy = true;
				let base64File = $('.background-image-dropify').converter2Base64();
				this.s3Service.uploadBase64(base64File)
				.subscribe(
					res => {	
						console.log(res['data'].Location);
						self.SettingData['Rewards_Card']['Background_Image'] = 	res['data'].Location;					
						self.postCount = 1;
						self.postBusy = false;
					},
					err => {
						// this.errorMsg = 'Could not upload image.';
						self.postCount = 1;
						self.postBusy = false;
						self.SettingData['Rewards_Card']['Background_Image'] = "";
					}
				);
			} else {
				if (self.postCount == 0) {
					self.postCount = 1;
				}
				if ($('#app_header_image')[0].isChanged && self.postCount == 1) {
					if (self.postBusy == true) {
						return;
					}
					self.postBusy = true;
					let base64File = $('.header-image-dropify').converter2Base64();
					this.s3Service.uploadBase64(base64File)
					.subscribe(
						res => {	
							console.log(res['data'].Location);
							self.SettingData['Rewards_Card']['Header_Image'] = 	res['data'].Location;					
							self.postCount = 2;
						},
						err => {
							// this.errorMsg = 'Could not upload image.';
							self.postCount = 2;
							self.SettingData['Rewards_Card']['Header_Image'] = "";
						}
					);
				} else {
					if (self.postCount == 1) {
						self.postCount = 2;
					}
					if ($('#app_icon_image')[0].isChanged && self.postCount == 2) {
						if (self.postBusy == true) {
							return;
						}
						self.postBusy = true;
						let base64File = $('.icon-image-dropify').converter2Base64();
						this.s3Service.uploadBase64(base64File)
						.subscribe(
							res => {	
								console.log(res['data'].Location);
								self.SettingData['Rewards_Card']['Icon_Image'] = 	res['data'].Location;					
								self.postCount = 3;
								self.postBusy = false;
							},
							err => {
								// this.errorMsg = 'Could not upload image.';
								self.postCount = 3;
								self.postBusy = false;
								self.SettingData['Rewards_Card']['Icon_Image'] = "";
							}
						);
					} else {
						if (self.postCount == 2) {
							self.postCount = 3;
						}
						if ($('#app_login_icon_image')[0].isChanged && self.postCount == 3) {
							if (self.postBusy == true) {
								return;
							}
							self.postBusy = true;
							let base64File = $('.login-icon-image-dropify').converter2Base64();
							this.s3Service.uploadBase64(base64File)
							.subscribe(
								res => {	
									console.log(res['data'].Location);
									self.SettingData['Login_Register']['Icon_Image'] = 	res['data'].Location;					
									self.postCount = 4;
									self.postBusy = false;
								},
								err => {
									// this.errorMsg = 'Could not upload image.';
									self.postCount = 4;
									self.postBusy = false;
									self.SettingData['Login_Register']['Icon_Image'] = "";
								}
							);
						} else {
							self.postCount = 4;
							self.postBusy = false;
							const SettingBuffer = {
								value: {
									app_id: this.appId,
									json: JSON.stringify(this.SettingData),
								}
							};
							this.commonService.postData(SettingBuffer.value, 'saveReviewSetting').subscribe(res => {
								debugger;
								console.log(res);
							},
							error => {
								debugger;
								console.log(error);
							});
							clearInterval(interval);
							NProgress.done();
						}
					}
				}
			}
		},100);

		
		
	}

	

	

	
}