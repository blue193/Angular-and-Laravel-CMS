import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})

export class RewardsComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = -1;
  

  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'Rewards',
        path: '/rewards',
        icon: 'icmn-coin-dollar',
        index: 0
      },
      {
        label: 'Redemptions',
        path: '/rewards/redemption',
        icon: 'icmn-loop2',
        index: 1
      },
      {
        label: 'Check Ins',
        path: '/rewards/checkin',
        icon: 'icmn-cloud-check',
        index: 2
      },
      {
        label: 'Staff',
        path: '/rewards/staff',
        icon: 'icmn-user-tie',
        index: 3
      },
      {
        label: 'Manage Members',
        path: '/rewards/member',
        icon: 'icmn-users',
        index: 4
      },
      {
        label: 'Modified Transactions',
        path: '/rewards/modified-transaction',
        icon: 'icmn-shuffle',
        index: 5
      },
      {
        label: 'Setting',
        path: '/rewards/setting',
        icon: 'icmn-database',
        index: 6
      },
    ];
  }

  ngOnInit() {
    this.activeLinkIndex = this.navLinks.indexOf(
      this.navLinks.slice().reverse().find(tab => (this.router.url).includes(tab.path))
    ); 
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.slice().reverse().find(tab => (this.router.url).includes(tab.path))
      );  
    });
    // $('.mat-ink-bar').attr('style','background: #0190fe !important');
  }

}