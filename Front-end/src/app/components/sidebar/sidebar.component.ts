import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { faHome, faPersonHiking, faTag, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LogoutButtonComponent } from 'src/app/shared/logout-button/logout-button.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, LogoutButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    faHome = faHome;
    faPersonHiking = faPersonHiking;
    faTag = faTag;
    faUser = faUser;
    faBars = faBars;
    faTimes = faTimes;
    isSidebarExpanded = false;

    constructor(public authService: AuthService,) { }

    ngOnInit(): void {
    };

    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }

    private updateSidebarState(): void {
      if (window.innerWidth >= 768) {
        this.isSidebarExpanded = false;
      }
    }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateSidebarState();
  }
}
