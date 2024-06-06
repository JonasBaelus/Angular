import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-page-loader',
  template: `
    <div class="animate-spin h-20 w-20 m-auto">
      <img [src]="loadingImg" alt="Loading..." />
    </div>
  `,
})
export class PageLoaderComponent {
  loadingImg = 'assets/loader.svg';
}