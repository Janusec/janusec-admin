import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from './application.service';
import { AuthUser } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  position = 'right';
  showSidenav = true;
  constructor(
    private router: Router,
    public applicationService: ApplicationService) {  
   }

  ngOnInit() {
  }  

  toggleSidenav() {
      this.showSidenav = !this.showSidenav;
  }

}
