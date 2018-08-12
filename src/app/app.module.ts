import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpModule }    from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { ApplicationService } from './application.service';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationDetailComponent } from './application-detail/application-detail.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component';
import { FooterComponent } from './footer/footer.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UsermgmtComponent } from './usermgmt/usermgmt.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FirewallComponent } from './firewall/firewall.component';
import { PolicyComponent } from './policy/policy.component';
import { NodesComponent } from './nodes/nodes.component';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogsComponent } from './logs/logs.component';
import { LogDetailComponent } from './log-detail/log-detail.component';
import { CCLogsComponent } from './cclogs/cclogs.component';
import { CCLogDetailComponent } from './cclog-detail/cclog-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { FrontpageComponent } from './frontpage/frontpage.component';


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';


@NgModule({
  exports:[
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
  ],
  declarations: []
})
export class MaterialModule{}

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent,
    NavbarComponent,
    LoginFormComponent,
    MessagesComponent,
    ApplicationsComponent,
    ApplicationDetailComponent,
    CertificatesComponent,
    CertificateDetailComponent,
    FooterComponent,
    UsermgmtComponent,
    UserDetailComponent,
    FirewallComponent,
    PolicyComponent,
    NodesComponent, 
    NodeDetailComponent,
    LogsComponent,
    LogDetailComponent,
    CCLogsComponent, 
    CCLogDetailComponent,
    SettingsComponent,
    FrontpageComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule, 
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MessageService, 
    ApplicationService,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
