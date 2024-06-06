import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { PageLoaderComponent } from 'src/app/shared/page-loader/page-loader.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, PageLoaderComponent, FontAwesomeModule, SidebarComponent, NgxPaginationModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  errorMessage: string = '';
  isLoading: boolean = true;
  users: any;
  users$: Subscription = new Subscription();
  p: number = 1; // Current page

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.users$ = this.userService
      .getUsers()
      .subscribe((result) => {
        (this.users = result), (this.isLoading = false);
      });
  }

}
