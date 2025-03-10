import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './/app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { RPCService } from './rpc.service';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationDetailComponent } from './application-detail/application-detail.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { CertificateDetailComponent } from './certificate-detail/certificate-detail.component';
import { FooterComponent } from './footer/footer.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UsermgmtComponent } from './usermgmt/usermgmt.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { WAFComponent } from './waf/waf.component';
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
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { WebsshComponent } from './webssh/webssh.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HealthCheckComponent } from './health-check/health-check.component';
import { VipAppsComponent } from './vip-apps/vip-apps.component';
import { VipAppComponent } from './vip-app/vip-app.component';
import { RefererComponent } from './referer/referer.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AuthcodeRegisterComponent } from './authcode-register/authcode-register.component';
import { CcComponent } from './cc/cc.component';
import { IpPolicyComponent } from './ip-policy/ip-policy.component';
import { DiscoveryRuleDialog } from './discovery-rules/discovery-rule-dialog';
import { DiscoveryRulesComponent } from './discovery-rules/discovery-rules.component';
import { ApiInterfaceComponent } from './api-interface/api-interface.component';
import { CookieDialogComponent } from './cookie-dialog/cookie-dialog.component';
import { CookieRefsComponent } from './cookie-refs/cookie-refs.component';
import { CookieRefDialogComponent } from './cookie-ref-dialog/cookie-ref-dialog.component';
import { DnsManagerComponent } from './dns-manager/dns-manager.component';
import { DnsDialogComponent } from './dns-dialog/dns-dialog.component';
import { DnsDomainsComponent } from './dns-domains/dns-domains.component';
import { DnsDomainComponent } from './dns-domain/dns-domain.component';

@NgModule({
    exports: [
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
export class MaterialModule { }

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        NavbarComponent,
        LoginFormComponent,
        MessagesComponent,
        ApplicationsComponent,
        ApplicationDetailComponent,
        CcComponent,
        CertificatesComponent,
        CertificateDetailComponent,
        FooterComponent,
        UsermgmtComponent,
        UserDetailComponent,
        WAFComponent,
        IpPolicyComponent,
        PolicyComponent,
        NodesComponent,
        NodeDetailComponent,
        LogsComponent,
        LogDetailComponent,
        CCLogsComponent,
        CCLogDetailComponent,
        SettingsComponent,
        FrontpageComponent,
        WebsshComponent,
        HealthCheckComponent,
        VipAppsComponent,
        VipAppComponent,
        RefererComponent,
        AuthcodeRegisterComponent,
        DiscoveryRuleDialog,
        DiscoveryRulesComponent,
        ApiInterfaceComponent,
        CookieDialogComponent,
        CookieRefsComponent,
        CookieRefDialogComponent,
        DnsDomainsComponent,
        DnsDomainComponent,
        DnsManagerComponent,
        DnsDialogComponent
    ],
    imports: [
        MaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        QRCodeModule
    ],
    providers: [MessageService,
        RPCService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
