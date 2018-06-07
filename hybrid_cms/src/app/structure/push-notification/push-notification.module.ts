import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { PushNotificationComponent } from './push-notification.component';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';

import { ColorPickerModule } from 'ngx-color-picker';


export const routes: Routes = [
  { path: 'push-notification', component: PushNotificationComponent,
   canActivate: [AuthGuard],
   canDeactivate: [CanDeactivateGuardService]  }
];


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes),
    ColorPickerModule,
  ],

  declarations: [
    PushNotificationComponent
  ],

  providers: [SharedService]

})

export class PushNotificationModule { }
