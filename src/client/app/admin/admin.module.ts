import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { AdminDashComponent } from './admin-dash.component';
import { ManageIssuesComponent } from './manage-issues.component';
import { ManageUsersComponent } from './manage-users.component';

import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule
  ],
  declarations: [
    AdminComponent,
    AdminDashComponent,
    ManageIssuesComponent,
    ManageUsersComponent
  ]
})

export class AdminModule { }
