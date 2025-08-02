import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RPCService } from './services/rpc.service';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider, MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { Navbar } from './navbar/navbar';
import { Messages } from './messages/messages';
import { Footer } from './footer/footer';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    Navbar,
    Messages,
    Footer,
    RouterOutlet,
    RouterModule,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    MatNavList,
    MatListItem,
    MatIcon,
    MatDivider,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('janusec-admin');
  position = 'right';
  showSidenav = true;
  constructor(
    public rpcService: RPCService,
    private iconRegistry: MatIconRegistry) {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  ngOnInit() {
  }

  toggleSidenav() {
    this.showSidenav = !this.showSidenav;
  }
}
