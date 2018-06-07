import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonService } from './../../../common.service';
import { Observable } from 'rxjs/Observable';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
    selector: 'app-modified-transaction',
    templateUrl: './modified-transaction.component.html',
    styleUrls: []
})
export class ModifiedTransactionComponent implements OnInit { 
	public form = {
		'value': {
		  'id': ''
		}
	}; 

	rdata = [];
	modified_transactions: any[];
	staffs: any[];
	is_error = false;
	error_message = '';
	success_message = '';
	is_success = false;
	appId: string;

	handleTimer: Observable<any>;

	constructor(private commonService: CommonService) {
		this.commonService.isAuthorizedRoute();
		this.handleTimer = Observable.timer(1000);
	}

	initDatatable(): void {
		const handleDelay = Observable.timer(100);
		handleDelay.subscribe(() => {
			$('#modified_transactionsDatatable').DataTable({ responsive: true });
		})
	}

	export() {
		new Angular2Csv(this.modified_transactions, 'export_modified_transactions_' + Date() + '.csv'); 
	}

	getModifiedTransactions() {
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		this.commonService.postData({'app_id': this.appId}, 'fetchAllModifiedTransactions').subscribe(res => {
				this.modified_transactions = JSON.parse(res)['data'];
				this.modified_transactions.map(modified_transaction => {
					modified_transaction.member_name = (modified_transaction.member_first_name ? modified_transaction.member_first_name + ' ' : '') 
						+ (modified_transaction.member_last_name ? modified_transaction.member_last_name : '');
					modified_transaction.staff_name = (modified_transaction.staff_first_name ? modified_transaction.staff_first_name + ' ' : '') 
						+ (modified_transaction.staff_last_name ? modified_transaction.staff_last_name : '');
				});
				this.handleTimer.subscribe(() => {
					NProgress.done();
				});
				this.initDatatable();
			}, error => {
				this.rdata = JSON.parse(error._body);
		        this.is_error = true;
		        this.is_success = false;
		        this.error_message = this.rdata['message'];
		        this.handleTimer.subscribe(() => {
		          NProgress.done();
		        });
			});
	}

	getStaffs() {
		this.commonService.postData({'app_id': this.appId}, 'fetchAllStaffs').subscribe(res => {
				this.staffs = JSON.parse(res)['data'];
				this.staffs.map(staff => staff.name = (staff.first_name ? staff.first_name + ' ' : '') + (staff.last_name ? staff.last_name : ''));
			}, error => {
				this.rdata = JSON.parse(error._body);
		        this.is_error = true;
		        this.is_success = false;
			});
	}

	selectStaff(value) {
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		let conditions = {'app_id': this.appId};
		if(+value != -1) {
			conditions['staff_id'] = value;
		}
		this.commonService.postData(conditions, 'fetchModifiedTransactionsByCondition').subscribe(res => {
				this.modified_transactions = JSON.parse(res)['data'];
				this.modified_transactions.map(modified_transaction => {
					modified_transaction.member_name = (modified_transaction.member_first_name ? modified_transaction.member_first_name + ' ' : '') 
						+ (modified_transaction.member_last_name ? modified_transaction.member_last_name : '');
					modified_transaction.staff_name = (modified_transaction.staff_first_name ? modified_transaction.staff_first_name + ' ' : '') 
						+ (modified_transaction.staff_last_name ? modified_transaction.staff_last_name : '');
				});
				
				const table = $('#modified_transactionsDatatable').DataTable();
				table.destroy();
				setTimeout(() => {
					$('#modified_transactionsDatatable').DataTable({
					  responsive: true
					});
				}, 1000);
				this.handleTimer.subscribe(() => {
					NProgress.done();
				});
			}, error => {
				this.rdata = JSON.parse(error._body);
		        this.is_error = true;
		        this.is_success = false;
		        this.error_message = this.rdata['message'];
		        this.handleTimer.subscribe(() => {
		          NProgress.done();
		        });
			});
	}

	ngOnInit() {
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		$("#mySidenav").css('display','none');
		this.commonService.isAuthorizedRoute();

		$(function () {
		  // Handle error message
		  $(document).on('click', '.alert-close', function () {
		    $('.alert-close').hide();
		  });
		});

		if (this.commonService.isMessage()) {
		  const success_message = this.commonService.getMessage();
		  $(function () {
		    $.notify({
		      title: '',
		      message: success_message
		    }, {
		        type: 'success'
		      });
		  });
		  this.commonService.removeMessage();
		}
		this.getModifiedTransactions();
		this.getStaffs();
	}

	deleteModifiedTransaction(id) {
		this.form.value.id = id;
	    const self = this;

	    swal({
	      title: "Are you sure?",
	      text: "You will not be able to recover this record",
	      type: "warning",
	      showCancelButton: true,
	      confirmButtonClass: "btn-danger",
	      confirmButtonText: "Yes, remove it",
	      cancelButtonText: "Cancel",
	      closeOnConfirm: false,
	      closeOnCancel: true
	    },
	      function (isConfirm) {
	        if (isConfirm) {
	          self.deleteModifiedTransactionData(id);
	          swal({
	            title: "Deleted!",
	            text: "Your record has been deleted.",
	            type: "success",
	            confirmButtonClass: "btn-success"
	          });
	        } else {
	          swal({
	            title: "Cancelled",
	            text: "Your record is safe :)",
	            type: "error",
	            confirmButtonClass: "btn-danger"
	          });
	        }
	      });
	}

	deleteModifiedTransactionData(id) {
		this.commonService.postData({'app_id': this.appId, 'id': id}, 'deleteModifiedTransaction').subscribe(res => {
		  	this.modified_transactions = JSON.parse(res)['data'];
			this.modified_transactions.map(modified_transaction => {
				modified_transaction.member_name = (modified_transaction.member_first_name ? modified_transaction.member_first_name + ' ' : '') 
					+ (modified_transaction.member_last_name ? modified_transaction.member_last_name : '');
				modified_transaction.staff_name = (modified_transaction.staff_first_name ? modified_transaction.staff_first_name + ' ' : '') 
					+ (modified_transaction.staff_last_name ? modified_transaction.staff_last_name : '');
			});

			this.is_success = true;
			this.is_error = false;
			const table = $('#modified_transactionsDatatable').DataTable();
			table.destroy();
			setTimeout(() => {
				$('#modified_transactionsDatatable').DataTable({
				  responsive: true
				});
			}, 1000);
			this.success_message = this.rdata['message'];
		},
		  error => {
		    this.rdata = JSON.parse(error._body);
		    this.is_error = true;
		    this.is_success = false;
		    this.error_message = this.rdata['message'];
		  }
		);
	}


}
