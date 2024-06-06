import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faCog,
  faDashboard,
  faEdit,
  faEnvelope,
  faPlane,
  faQuestion,
  faSignOutAlt,
  faTimes,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@auth0/auth0-angular';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { SignupButtonComponent } from '../signup-button/signup-button.component';
import { RoleService } from 'src/app/services/role/role.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    LoginButtonComponent,
    LogoutButtonComponent,
    UserProfileComponent,
    SignupButtonComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  faBars = faBars;
  faTimes = faTimes;
  isMenuOpen = false; // Flag to track menu state
  showDropdown = false;
  faUser = faUser;
  faEdit = faEdit;
  faEnvelope = faEnvelope;
  faCog = faCog;
  faQuestion = faQuestion;
  faSignOutAlt = faSignOutAlt;
  faPlane = faPlane;
  faDashboard = faDashboard;

  public loggedInUser: any;

  isAuthenticated = signal(false);
  isAdmin = signal(false);

  constructor(
    public authService: AuthService,
    public roleService: RoleService
  ) {
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated.set(auth);

      if (auth) {
        // Your additional logic for logged-in users here
        this.roleService.hasPermission('getall:trips').subscribe((r) => {
          this.isAdmin.set(r);
        });
      }
    });
  }

  handleSignUp(): void {
    this.authService.loginWithRedirect({
      appState: {
        target: '/',
      },
      authorizationParams: {
        prompt: 'login',
        screen_hint: 'signup',
      },
    });
  }

  ngOnInit(): void {
    if (this.authService.user$) {
      this.authService.user$.subscribe((data) => {
        this.loggedInUser = data;
      });
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Function to toggle the menu and apply the lock-screen class
  onToggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
